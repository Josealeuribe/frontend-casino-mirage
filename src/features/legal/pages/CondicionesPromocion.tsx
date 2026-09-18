import LegalPage from "../LegalPage";
import { PRIZES } from "@/features/landing/data/prizes";
import { SEDES } from "@/shared/data/sedes";

export default function CondicionesPromocion() {
  return (
    <LegalPage
      antetitulo="Legal"
      titulo="Condiciones de la Promoción"
      actualizado="16 de septiembre de 2026"
    >
      <h2>1. Nombre y vigencia</h2>
      <p>
        La promoción <strong>"Gira y Gana"</strong> de Centro Club Mirage está vigente desde su
        publicación en este Sitio hasta el <strong>30 de septiembre de 2026</strong>. Vencida esta
        fecha, la mecánica de la ruleta se desactiva y los bonos pendientes de reclamar pierden
        toda validez.
      </p>

      <h2>2. Mecánica</h2>
      <p>
        Cada usuario registrado dispone de <strong>tres (3) giros</strong> de la ruleta virtual.
        Cada giro otorga, de forma aleatoria, uno de los siguientes bonos:
      </p>
      <ul>
        {[...PRIZES]
          .sort((a, b) => b.amount - a.amount)
          .map((p) => (
            <li key={p.id}>
              {p.name} — {p.badge.toLowerCase()}
            </li>
          ))}
      </ul>
      <p>
        La probabilidad de cada bono no es uniforme: los bonos de menor valor tienen mayor
        probabilidad de asignación que el bono mayor. El resultado de cada giro se determina de
        forma aleatoria en el momento de jugar y es definitivo.
      </p>

      <h2>3. Redención — sede física asignada automáticamente</h2>
      <p>
        <strong>
          Los bonos ganados no son transferibles, no son canjeables por dinero en efectivo y no se
          entregan por ningún medio digital, transferencia bancaria, consignación o giro.
        </strong>{" "}
        La única forma de reclamar un bono es presentándose personalmente, con el documento de
        identidad del titular de la cuenta, en la sede física que le fue asignada.
      </p>
      <p>
        <strong>Asignación automática y equitativa:</strong> en el momento en que se gana el bono,
        el sistema le asigna de forma automática una de nuestras sedes — repartiendo los bonos por
        igual entre ambas — y esa es la única sede en la que ese bono puede redimirse. El titular
        no elige la sede ni puede solicitar cambiarla; puede consultar cuál le corresponde desde su
        cuenta. Nuestras sedes son:
      </p>
      <ul>
        {SEDES.map((s) => (
          <li key={s.clave}>
            {s.nombre} — {s.direccion}, {s.ciudad}
          </li>
        ))}
      </ul>

      <h2>4. Restricciones</h2>
      <ul>
        <li>Un cupo de tres giros por persona; no se permiten cuentas duplicadas.</li>
        <li>El bono es personal e intransferible: solo lo reclama el titular de la cuenta.</li>
        <li>No es acumulable con otras promociones vigentes, salvo indicación expresa.</li>
        <li>
          Centro Club Mirage podrá anular giros o bonos obtenidos mediante manipulación técnica,
          registros fraudulentos o incumplimiento de estas condiciones.
        </li>
      </ul>

      <h2>5. Modificaciones</h2>
      <p>
        Centro Club Mirage podrá extender, modificar, suspender o cancelar la promoción en
        cualquier momento, mediante aviso publicado en este Sitio, sin que ello genere derecho a
        compensación alguna para los participantes, salvo por los bonos ya asignados y pendientes
        de reclamar dentro del plazo vigente al momento del cambio.
      </p>

      <h2>6. Cumplimiento normativo</h2>
      <p>
        Esta promoción se desarrolla en el marco de la normativa vigente para casinos y salas de
        juego autorizadas por Coljuegos. La participación implica la aceptación de estas
        condiciones y de los Términos y Condiciones generales del Sitio.
      </p>
    </LegalPage>
  );
}
