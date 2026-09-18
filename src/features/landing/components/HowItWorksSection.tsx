const STEPS = [
  {
    num: "01",
    title: "Gira la Ruleta",
    desc: "Presiona el botón y participa en nuestra promoción de bienvenida. Es gratis y no requiere registro previo.",
  },
  {
    num: "02",
    title: "Descubre tu Bono",
    desc: "La ruleta se detiene y revela cuál de los tres bonos te corresponde: $10.000, $20.000 o $50.000.",
  },
  {
    num: "03",
    title: "Redímelo en el casino",
    desc: "Completa tu registro y te asignamos automáticamente la sede donde debes reclamarlo. Tu bono queda reservado mientras lo haces.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative py-28 px-4 overflow-hidden"
    >
      {/* Sin fondo propio a proposito. Esta seccion tenia una foto de casino
          (un remoto de Unsplash) y luego un tinte translucido; ambos dibujaban
          un recuadro con borde visible sobre la imagen global. El fondo lo
          pone solo LandingLayout, para que se lea plano y continuo de arriba
          abajo. El unico que conserva recuadro es el footer. */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-xs font-semibold tracking-[0.28em] uppercase mb-4"
            style={{ color: "#D4A827" }}
          >
            Proceso Simple
          </p>
          <h2
            className="text-5xl md:text-6xl font-black text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Cómo Funciona
          </h2>
          {/* Gold underline */}
          <div className="flex justify-center mt-5">
            <div
              className="h-px w-20"
              style={{ background: "linear-gradient(90deg, transparent, #D4A827, transparent)" }}
            />
          </div>
        </div>

        {/* Steps.
            Antes esto era un flex-row donde cada columna metia [bloque][linea
            conectora] pegados a la izquierda sin justify-content -- sin nada
            que los centrara dentro de su propia columna. Como la ultima
            columna no lleva conector, su contenido pesaba menos que las otras
            dos, y el conjunto quedaba desigualmente espaciado (los circulos
            01/02/03 no caian a distancias iguales).

            Con un grid de 3 columnas iguales, cada bloque queda centrado en
            su propia columna sin ayuda extra. El conector es una linea
            absoluta que arranca en el centro de una columna y mide exactamente
            el ancho de una columna, asi que llega justo al centro de la
            siguiente -- sin depender de anchos fijos en pixeles. */}
        <div className="grid grid-cols-1 gap-y-14 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center px-4 text-center md:px-6">
              {i < STEPS.length - 1 && (
                <div
                  className="pointer-events-none absolute hidden md:block"
                  style={{
                    // 50px = mitad de los 100px del circulo, para que la linea
                    // cruce justo por su centro vertical.
                    top: 50,
                    left: "50%",
                    width: "100%",
                    height: 1,
                    background: "linear-gradient(90deg, rgba(212,168,39,0.5), rgba(212,168,39,0.15))",
                  }}
                />
              )}

              {/* Circle */}
              <div
                className="relative z-10 mb-8 flex flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  width: 100,
                  height: 100,
                  background: "radial-gradient(circle, rgba(30,22,80,0.95) 0%, rgba(12,9,36,0.95) 100%)",
                  border: "2px solid rgba(212,168,39,0.55)",
                  boxShadow: "0 0 30px rgba(212,168,39,0.1), inset 0 0 24px rgba(212,168,39,0.06)",
                }}
              >
                <span
                  className="select-none text-3xl font-black leading-none"
                  style={{
                    color: "#D4A827",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.02em",
                  }}
                >
                  {step.num}
                </span>
                {/* Outer glow ring */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ boxShadow: "0 0 0 8px rgba(212,168,39,0.04)" }}
                />
              </div>

              <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
              <p className="max-w-[220px] text-sm leading-relaxed" style={{ color: "rgba(237,232,252,0.5)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
