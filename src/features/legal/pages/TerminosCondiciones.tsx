import LegalPage from "../LegalPage";
import { SEDES } from "@/shared/data/sedes";

export default function TerminosCondiciones() {
  return (
    <LegalPage
      antetitulo="Legal"
      titulo="Términos y Condiciones"
      actualizado="16 de septiembre de 2026"
    >
      <h2>1. Objeto</h2>
      <p>
        Estos términos regulan el acceso y uso del sitio web de <strong>Centro Club Mirage</strong>{" "}
        (en adelante, "el Sitio") y la promoción "Gira y Gana", una actividad promocional sin
        ánimo de lucro para el jugador, dirigida a incentivar la visita presencial a nuestras
        sedes físicas en Arauca. El uso del Sitio implica la aceptación plena de estos términos.
      </p>

      <h2>2. Naturaleza de la promoción</h2>
      <p>
        "Gira y Gana" es una promoción de bienvenida que otorga a cada usuario registrado hasta{" "}
        <strong>tres (3) intentos</strong> de la ruleta virtual. Cada intento asigna al azar uno
        de los siguientes bonos:
      </p>
      <ul>
        <li>Bono de $10.000 COP</li>
        <li>Bono de $20.000 COP</li>
        <li>Bono de $50.000 COP</li>
      </ul>
      <p>
        La asignación del bono es aleatoria y no está sujeta a intervención manual. El resultado
        de cada giro es definitivo y no admite repetición.
      </p>

      <h2>3. Condiciones de redención</h2>
      <p>
        <strong>
          Los bonos obtenidos en la promoción son redimibles única y exclusivamente de forma
          presencial en nuestras sedes físicas
        </strong>
        , previa presentación del documento de identidad del titular. Bajo ninguna circunstancia
        se realizan pagos en efectivo, consignaciones, transferencias bancarias, giros ni ningún
        otro medio de entrega a distancia. El bono no tiene equivalente en dinero y no puede
        cambiarse por su valor en efectivo.
      </p>
      <p>Sedes habilitadas para la redención:</p>
      <ul>
        {SEDES.map((s) => (
          <li key={s.clave}>
            {s.nombre} — {s.direccion}, {s.ciudad}
          </li>
        ))}
      </ul>
      <p>
        El bono queda reservado a nombre del usuario desde el momento del giro y debe reclamarse
        antes de la fecha límite de la promoción, indicada en la página de inicio (
        <strong>30 de septiembre de 2026</strong>). Vencido ese plazo, el bono no reclamado pierde
        toda validez sin lugar a compensación.
      </p>

      <h2>4. Requisitos de participación</h2>
      <ul>
        <li>Ser mayor de 18 años, con documento de identidad vigente.</li>
        <li>Registrarse en el Sitio con datos veraces y verificables.</li>
        <li>Un (1) cupo de tres intentos por persona. No se admiten cuentas duplicadas.</li>
        <li>
          No haber sido inscrito voluntariamente en el Registro de Autoexclusión de Coljuegos.
        </li>
      </ul>

      <h2>5. Modificación y suspensión</h2>
      <p>
        Centro Club Mirage podrá modificar, suspender o cancelar la promoción, total o
        parcialmente, en cualquier momento, mediante aviso publicado en el Sitio, cuando existan
        causas justificadas, incluyendo sospecha de fraude, manipulación técnica del sistema o
        incumplimiento de estos términos por parte del usuario.
      </p>

      <h2>6. Uso del sitio</h2>
      <p>
        El usuario se compromete a no utilizar el Sitio con fines distintos a los previstos, no
        intentar vulnerar su seguridad ni interferir con su funcionamiento. El acceso al Sitio no
        constituye ni sustituye el acceso físico a las salas de juego, que se rige por la
        normativa vigente de Coljuegos y los reglamentos internos de cada sede.
      </p>

      <h2>7. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Colombia, en particular por la
        normativa aplicable a los juegos de suerte y azar vigilados por Coljuegos. Cualquier
        controversia derivada de su interpretación se someterá a la jurisdicción de los jueces
        competentes en Arauca, Colombia.
      </p>
    </LegalPage>
  );
}
