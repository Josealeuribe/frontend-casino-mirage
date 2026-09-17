import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import VolverInicio from "@/shared/components/VolverInicio";
import { useTituloVista } from "@/shared/hooks/useTituloVista";
import { useAuth } from "@/features/auth/AuthContext";
import {
  ApiError,
  checkDisponibilidad,
  fetchUbicaciones,
  registerCliente,
  type RegistroPayload,
  type Ubicacion,
} from "@/shared/api/client";
import type { Prize } from "@/features/landing/data/prizes";

type DocType = RegistroPayload["docType"];
const TIPOS_DOCUMENTO: DocType[] = ["Cédula de Ciudadanía", "Pasaporte", "Tarjeta de Extranjería"];

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  outline: "none",
  width: "100%",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  color: "#EDE8FC",
  fontSize: "0.875rem",
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(237,232,252,0.4)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function edadValida(fechaISO: string): boolean {
  if (!fechaISO) return false;
  const nacimiento = new Date(fechaISO);
  if (Number.isNaN(nacimiento.getTime())) return false;
  const edad = Math.floor((Date.now() - nacimiento.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return edad >= 18;
}

function passwordCumplePolitica(pass: string): boolean {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
}

const advertenciaStyle: React.CSSProperties = {
  background: "rgba(239,68,68,0.08)",
  color: "#FCA5A5",
  border: "1px solid rgba(239,68,68,0.18)",
};

/** Registro de clientes: nace del ticket firmado que entrega la ruleta
 *  (POST /api/ruleta/girar-anonimo) al ganar un premio, pero tambien funciona
 *  sin el -- "ya tengo cuenta" y el registro directo no traen premio, y el
 *  backend simplemente crea el cliente sin bono (ver auth.routes.ts).
 *
 *  Los campos replican los que ya usa el registro de Casino-cucuta
 *  (Clients-innova/src/features/registration), incluida la cascada
 *  departamento/ciudad: ambos son <select> respaldados por el catálogo real
 *  que sirve GET /api/ubicaciones, no texto libre -- así no se puede
 *  registrar una ciudad que no exista o que no corresponda al departamento
 *  elegido (el backend igual lo revalida al crear la cuenta). */
export default function RegistrationPage() {
  useTituloVista("Registro");
  const navigate = useNavigate();
  const location = useLocation();
  const { setSessionFromRegistro } = useAuth();

  const state = (location.state ?? {}) as { ticket?: string | null; prize?: Prize | null };
  const prize = state.prize ?? null;

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    docType: TIPOS_DOCUMENTO[0] as DocType,
    docNum: "",
    birth: "",
    phone: "",
    dept: "",
    city: "",
    email: "",
    pass: "",
    passConfirm: "",
    terminos: false,
    datos: false,
    edad: false,
    promo: false,
    comms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codigoBono, setCodigoBono] = useState<string | null>(null);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacionesError, setUbicacionesError] = useState(false);

  useEffect(() => {
    fetchUbicaciones()
      .then((r) => setUbicaciones(r.departamentos))
      .catch(() => setUbicacionesError(true));
  }, []);

  const municipiosDelDepartamento = ubicaciones.find((d) => d.nombre === form.dept)?.municipios ?? [];

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Al cambiar de departamento, la ciudad elegida deja de ser valida (salvo
  // que por casualidad exista con el mismo nombre en el nuevo) -- se limpia
  // para no dejar un par departamento/ciudad inconsistente sin que se note.
  const setDept = (dept: string) => setForm((f) => ({ ...f, dept, city: "" }));

  // --- Validacion en tiempo real -------------------------------------
  // Se derivan de `form` en cada render (nada de estado propio ni debounce:
  // son calculos triviales) para poder avisar de un dato invalido apenas se
  // escribe, en vez de esperar a que se de click en "Crear cuenta".
  const fechaIngresada = form.birth !== "";
  const edadEsInvalida = fechaIngresada && !edadValida(form.birth);
  const passwordTocada = form.pass !== "";
  const passwordEsDebil = passwordTocada && !passwordCumplePolitica(form.pass);
  const confirmacionTocada = form.passConfirm !== "";
  const passwordsNoCoinciden = confirmacionTocada && form.pass !== form.passConfirm;

  // El checkbox "Aceptar todo" no es un campo propio: es un espejo de los 4
  // consentimientos reales. Al marcarlo los pone todos en true; si alguno se
  // desmarca despues, este deja de verse marcado solo -- no hay dos fuentes
  // de verdad que puedan desincronizarse.
  const todoAceptado = form.terminos && form.datos && form.edad && form.promo;
  const alternarAceptarTodo = (marcar: boolean) =>
    setForm((f) => ({ ...f, terminos: marcar, datos: marcar, edad: marcar, promo: marcar }));

  const formularioValido =
    !edadEsInvalida &&
    fechaIngresada &&
    form.dept !== "" &&
    form.city !== "" &&
    !passwordEsDebil &&
    passwordTocada &&
    !passwordsNoCoinciden &&
    confirmacionTocada &&
    todoAceptado;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!edadValida(form.birth)) {
      setError("Debes ser mayor de 18 años para registrarte.");
      return;
    }
    if (form.pass !== form.passConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!passwordCumplePolitica(form.pass)) {
      setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.");
      return;
    }
    if (!todoAceptado) {
      setError("Debes aceptar los términos, el tratamiento de datos, la mayoría de edad y las condiciones de la promoción.");
      return;
    }

    setLoading(true);
    try {
      const disponibilidad = await checkDisponibilidad({ email: form.email, docNum: form.docNum });
      if (disponibilidad.emailDisponible === false) {
        setError("Ya existe una cuenta con ese correo.");
        setLoading(false);
        return;
      }
      if (disponibilidad.docNumDisponible === false) {
        setError("Ya existe una cuenta con ese número de documento.");
        setLoading(false);
        return;
      }

      const resultado = await registerCliente({ ...form, ticket: state.ticket ?? undefined });
      setSessionFromRegistro(resultado);
      setCodigoBono(resultado.bono?.codigo ?? null);
      if (resultado.bonoError) setError(resultado.bonoError);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo completar el registro. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de exito: lo unico que de verdad importa mostrar aqui es el
  // codigo de canje -- es lo que el cliente presenta en caja.
  if (codigoBono) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <span
          className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#34D399", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          Cuenta creada
        </span>
        <h1 className="mb-3 text-3xl font-black text-white">¡Ya eres parte de Centro Club Mirage!</h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.55)" }}>
          Presenta este código en cualquiera de nuestras sedes junto con tu documento para reclamar tu bono.
        </p>
        <div
          className="mb-8 rounded-2xl px-8 py-5 text-2xl font-black tracking-[0.08em]"
          style={{ background: "rgba(212,168,39,0.1)", border: "1px solid rgba(212,168,39,0.3)", color: "#D4A827" }}
        >
          {codigoBono}
        </div>
        <button
          onClick={() => navigate("/cuenta")}
          className="rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)", boxShadow: "0 6px 28px rgba(107,50,214,0.4)" }}
        >
          Ir a mi cuenta
        </button>
      </section>
    );
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto mb-8 max-w-lg">
        <VolverInicio />
      </div>

      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-black text-white">Crea tu cuenta</h1>
          <p className="text-sm" style={{ color: "rgba(237,232,252,0.5)" }}>
            {prize ? "Completa tus datos para reclamar tu bono." : "Regístrate en Centro Club Mirage."}
          </p>
        </div>

        {prize && (
          <div
            className="mb-6 flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ background: "rgba(212,168,39,0.08)", border: "1px solid rgba(212,168,39,0.22)" }}
          >
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: "rgba(212,168,39,0.7)" }}>
                Tu premio
              </p>
              <p className="text-lg font-bold text-white">{prize.name}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl p-6" style={{ background: "rgba(14,11,40,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Nombres">
              <input style={inputStyle} required value={form.nombres} onChange={(e) => set("nombres", e.target.value)} />
            </Campo>
            <Campo label="Apellidos">
              <input style={inputStyle} required value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} />
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Tipo de documento">
              <select style={inputStyle} value={form.docType} onChange={(e) => set("docType", e.target.value as DocType)}>
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t} value={t} style={{ background: "#120E30" }}>
                    {t}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Número de documento">
              <input style={inputStyle} required value={form.docNum} onChange={(e) => set("docNum", e.target.value)} />
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Fecha de nacimiento">
              <input
                type="date"
                style={{ ...inputStyle, ...(edadEsInvalida ? { borderColor: "#F87171" } : {}) }}
                required
                // El `max` bloquea la mayoria de los selectores de fecha del
                // navegador, pero no a quien la escribe a mano digito por
                // digito -- de ahi que la advertencia de abajo se calcule
                // aparte en JS y no dependa solo de esta restriccion nativa.
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
                value={form.birth}
                onChange={(e) => set("birth", e.target.value)}
              />
            </Campo>
            <Campo label="Celular">
              <input type="tel" style={inputStyle} required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Campo>
          </div>
          {/* Advertencia en tiempo real: aparece apenas se elige una fecha de
              menor de edad, sin esperar a que se intente enviar el
              formulario -- a diferencia del resto de validaciones, esta es
              la unica que de verdad bloquea el registro por ley. */}
          {edadEsInvalida && (
            <p className="-mt-2 rounded-lg px-3 py-2 text-xs" style={advertenciaStyle}>
              Debes ser mayor de 18 años para registrarte con esta fecha de nacimiento.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Departamento">
              <select
                style={inputStyle}
                required
                disabled={ubicaciones.length === 0}
                value={form.dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="" style={{ background: "#120E30" }}>
                  {ubicacionesError ? "No se pudo cargar" : ubicaciones.length === 0 ? "Cargando..." : "Selecciona..."}
                </option>
                {ubicaciones.map((d) => (
                  <option key={d.nombre} value={d.nombre} style={{ background: "#120E30" }}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo label="Ciudad">
              <select
                style={inputStyle}
                required
                disabled={!form.dept}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              >
                <option value="" style={{ background: "#120E30" }}>
                  {form.dept ? "Selecciona..." : "Elige un departamento primero"}
                </option>
                {municipiosDelDepartamento.map((m) => (
                  <option key={m} value={m} style={{ background: "#120E30" }}>
                    {m}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
          {ubicacionesError && (
            <p className="-mt-2 rounded-lg px-3 py-2 text-xs" style={advertenciaStyle}>
              No se pudo cargar el listado de departamentos y ciudades. Recarga la página e intenta de nuevo.
            </p>
          )}

          <Campo label="Correo electrónico">
            <input type="email" style={inputStyle} required value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Campo>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Contraseña">
              <input
                type="password"
                style={{ ...inputStyle, ...(passwordEsDebil ? { borderColor: "#F87171" } : {}) }}
                required
                value={form.pass}
                onChange={(e) => set("pass", e.target.value)}
              />
            </Campo>
            <Campo label="Confirmar contraseña">
              <input
                type="password"
                style={{ ...inputStyle, ...(passwordsNoCoinciden ? { borderColor: "#F87171" } : {}) }}
                required
                value={form.passConfirm}
                onChange={(e) => set("passConfirm", e.target.value)}
              />
            </Campo>
          </div>
          {/* Mismo criterio que la fecha de nacimiento: el aviso cambia de
              color y de texto apenas se escribe, no solo al enviar. */}
          <p
            className="-mt-2 text-xs"
            style={{ color: passwordEsDebil ? "#FCA5A5" : "rgba(237,232,252,0.3)" }}
          >
            Mínimo 8 caracteres, con una mayúscula y un número.
          </p>
          {passwordsNoCoinciden && (
            <p className="-mt-2 rounded-lg px-3 py-2 text-xs" style={advertenciaStyle}>
              Las contraseñas no coinciden.
            </p>
          )}

          <div className="space-y-2.5 pt-2">
            {/* Solo los 2 consentimientos mas relevantes quedan como
                checkbox individual. Los otros dos (tratamiento de datos y
                condiciones de la promoción) se aceptan en bloque desde
                "Aceptar todo", justo debajo -- pero se siguen enviando y
                guardando igual que antes, uno por uno, en Consentimiento. */}
            {[
              {
                key: "terminos" as const,
                label: "Acepto los términos y condiciones",
                to: "/legal/terminos-y-condiciones?from=registro",
              },
              {
                key: "edad" as const,
                label: "Confirmo que soy mayor de 18 años",
                to: "/legal/juego-responsable?from=registro",
              },
            ].map((c) => (
              <label key={c.key} className="flex items-start gap-2.5 text-xs" style={{ color: "rgba(237,232,252,0.55)" }}>
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={form[c.key]}
                  onChange={(e) => set(c.key, e.target.checked)}
                />
                <span>
                  {c.label} —{" "}
                  <Link to={c.to} target="_blank" className="underline" style={{ color: "#D4A827" }}>
                    ver
                  </Link>
                </span>
              </label>
            ))}

            <label
              className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium"
              style={{
                color: "#D4A827",
                background: "rgba(212,168,39,0.06)",
                border: "1px solid rgba(212,168,39,0.18)",
              }}
            >
              <input type="checkbox" className="mt-0.5" checked={todoAceptado} onChange={(e) => alternarAceptarTodo(e.target.checked)} />
              <span>
                Aceptar todo: términos y condiciones, tratamiento de datos personales, mayoría de edad y condiciones de
                la promoción.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>
              <input type="checkbox" className="mt-0.5" checked={form.comms} onChange={(e) => set("comms", e.target.checked)} />
              <span>Quiero recibir novedades y promociones (opcional)</span>
            </label>
          </div>

          {error && (
            <p
              className="rounded-lg px-3 py-2.5 text-xs"
              style={{ background: "rgba(239,68,68,0.08)", color: "#FCA5A5", border: "1px solid rgba(239,68,68,0.18)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !formularioValido}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background:
                loading || !formularioValido ? "rgba(107,50,214,0.25)" : "linear-gradient(135deg, #6B32D6 0%, #1A5ED8 100%)",
              color: loading || !formularioValido ? "rgba(237,232,252,0.4)" : "#fff",
              boxShadow: loading || !formularioValido ? "none" : "0 6px 24px rgba(107,50,214,0.35)",
            }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </section>
  );
}
