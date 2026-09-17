import LegalPage from "../LegalPage";

export default function JuegoResponsable() {
  return (
    <LegalPage
      antetitulo="Legal"
      titulo="Juego Responsable"
      actualizado="16 de septiembre de 2026"
    >
      <h2>1. Nuestro compromiso</h2>
      <p>
        <strong>Centro Club Mirage</strong> opera bajo la vigilancia de Coljuegos y promueve el
        juego como una forma de entretenimiento, nunca como una fuente de ingresos ni como
        solución a problemas económicos o personales. Este apartado busca que cada visitante juegue
        de forma consciente, informada y responsable.
      </p>

      <h2>2. Solo para mayores de edad</h2>
      <p>
        El ingreso a nuestras salas de juego y la participación en cualquier promoción están
        reservados exclusivamente para personas mayores de 18 años. Nos reservamos el derecho de
        solicitar documento de identidad en cualquier momento y de negar el ingreso o la
        redención de bonos a quien no acredite su mayoría de edad.
      </p>

      <h2>3. Señales de alerta</h2>
      <p>Recomendamos buscar apoyo si usted o alguien cercano presenta alguna de estas señales:</p>
      <ul>
        <li>Jugar más tiempo o más dinero del que inicialmente se había planeado.</li>
        <li>Pedir dinero prestado o vender pertenencias para poder jugar.</li>
        <li>Descuidar responsabilidades familiares, laborales o económicas por el juego.</li>
        <li>Sentir ansiedad, irritabilidad o culpa relacionadas con el juego.</li>
        <li>Intentar "recuperar" pérdidas jugando más.</li>
      </ul>

      <h2>4. Recomendaciones</h2>
      <ul>
        <li>Defina un presupuesto de entretenimiento antes de ingresar y respételo.</li>
        <li>Establezca un límite de tiempo de juego.</li>
        <li>No juegue bajo efectos del alcohol o en estados de alteración emocional.</li>
        <li>El juego es entretenimiento, no una estrategia para generar ingresos.</li>
        <li>Nunca juegue con dinero destinado a necesidades básicas.</li>
      </ul>

      <h2>5. Autoexclusión</h2>
      <p>
        Coljuegos dispone de un Registro Único de Autoexclusión, mediante el cual cualquier
        persona puede solicitar voluntariamente que se le restrinja el acceso a establecimientos
        de juego en todo el territorio nacional. Si usted considera que necesita esta medida,
        puede solicitar información en cualquiera de nuestras sedes o directamente ante Coljuegos.
      </p>

      <h2>6. Línea de ayuda</h2>
      <p>
        Si usted o un familiar necesita orientación o apoyo relacionado con el juego, comuníquese
        con la línea nacional de atención: <strong>01-8000-111-444</strong>. La llamada es
        gratuita y confidencial.
      </p>
    </LegalPage>
  );
}
