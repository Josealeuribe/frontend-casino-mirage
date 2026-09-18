import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { SEDES } from "@/shared/data/sedes";
import { PRIZES } from "../data/prizes";

const NOMBRES_SEDES = SEDES.map((sede) => sede.nombre).join(" o ");
const MONTOS_ORDENADOS = [...PRIZES].sort((a, b) => a.amount - b.amount).map((p) => p.amount);
const MONTOS_TEXTO = MONTOS_ORDENADOS.map((m) => `$${m.toLocaleString("es-CO")}`).join(", ");

// Cada respuesta esta anclada a un hecho REAL ya definido en otra parte del
// sitio (condiciones de la promocion, terminos, juego responsable, el
// esquema de registro del backend) -- no son placeholders inventados. Si un
// dato cambia alla (fecha limite, sedes, montos), cambia aqui tambien porque
// se lee de la misma fuente (PRIZES, SEDES), salvo los que son texto legal
// fijo y que ya se repiten igual en las paginas legales.
const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "¿Qué es la promoción \"Gira y Gana\"?",
    a: "Es la promoción de bienvenida de Centro Club Mirage, casino físico vigilado por Coljuegos con dos sedes en Arauca. Gira la ruleta virtual, descubre el bono que te tocó y resérvalo a tu nombre completando el registro.",
  },
  {
    q: "¿Necesito registrarme para girar la ruleta?",
    a: "No. Girar es gratis y no pide registro previo. Solo te pedimos tus datos cuando ya ganaste un bono y quieres reservarlo a tu nombre para poder reclamarlo después.",
  },
  {
    q: "¿Cuántos intentos tengo para girar la ruleta?",
    a: "Tres (3) intentos por persona. Una vez los uses, la ruleta no vuelve a girar para esa cuenta hasta una próxima promoción.",
  },
  {
    q: "¿Qué bonos puedo ganar y cómo se decide cuál me toca?",
    a: `La promoción reparte tres bonos: ${MONTOS_TEXTO}. El resultado es aleatorio y definitivo al momento de girar; los bonos de menor valor tienen mayor probabilidad de salir que el bono mayor.`,
  },
  {
    q: "¿Qué requisitos debo cumplir para participar?",
    a: "Ser mayor de 18 años y registrarte con datos veraces usando un documento vigente: Cédula de Ciudadanía, Pasaporte o Tarjeta de Extranjería. Ese mismo documento es el que debes presentar después, en caja, para reclamar el bono.",
  },
  {
    q: "¿Puedo crear más de una cuenta para tener más intentos?",
    a: "No. El cupo es de tres intentos y un bono por persona; no se permiten cuentas duplicadas y cualquier giro o bono obtenido así puede anularse.",
  },
  {
    q: "¿Hasta cuándo puedo canjear mi bono?",
    a: "Tienes hasta el 30 de septiembre de 2026 para canjear tu bono. Pasada esa fecha, los bonos no reclamados pierden toda validez.",
  },
  {
    q: "¿Dónde puedo reclamar mi bono?",
    a: `El bono se redime presencialmente en ${NOMBRES_SEDES}, sobre la Cra. 22 en Arauca. Presenta tu documento de identidad y tu código de bono en caja.`,
  },
  {
    q: "¿El bono se puede cambiar por dinero en efectivo o transferir a otra persona?",
    a: "No. El bono es personal e intransferible: solo lo reclama el titular de la cuenta, no es convertible en efectivo y no se entrega por transferencia, consignación ni ningún otro medio digital.",
  },
  {
    q: "¿Cómo consulto si ya gané un bono o si ya lo canjeé?",
    a: "Inicia sesión con el correo o documento y la contraseña que usaste al registrarte. En tu cuenta encuentras el código del bono, su vigencia y si ya fue canjeado.",
  },
  {
    q: "¿Qué hago si el juego deja de ser entretenimiento y se vuelve un problema?",
    a: (
      <>
        Comunícate a la línea nacional gratuita y confidencial <strong>01-8000-111-444</strong>, o
        pregunta en cualquiera de nuestras sedes por el Registro Único de Autoexclusión de
        Coljuegos. Más detalle en{" "}
        <Link to="/legal/juego-responsable" className="underline underline-offset-2" style={{ color: "#8B5CE8" }}>
          Juego Responsable
        </Link>
        .
      </>
    ),
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="text-xs font-medium tracking-[0.22em] uppercase mb-4 inline-block px-4 py-1.5 rounded-full"
            style={{ color: "#00C4D8", background: "rgba(0,196,216,0.1)", border: "1px solid rgba(0,196,216,0.22)" }}
          >
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-5 mb-4" style={{ letterSpacing: "-0.01em" }}>
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: `1px solid ${open === i ? "rgba(107,50,214,0.35)" : "rgba(255,255,255,0.06)"}`,
                background: open === i ? "rgba(107,50,214,0.07)" : "rgba(14,11,40,0.6)",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4.5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
              >
                <span className="font-medium text-sm" style={{ color: open === i ? "#EDE8FC" : "rgba(237,232,252,0.75)" }}>
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-250"
                  style={{
                    background: open === i ? "rgba(107,50,214,0.25)" : "rgba(255,255,255,0.05)",
                    color: open === i ? "#8B5CE8" : "rgba(255,255,255,0.3)",
                    transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  }}
                >
                  <Plus size={11} strokeWidth={1.5} />
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.5)" }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
