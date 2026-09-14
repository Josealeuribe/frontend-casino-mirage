const STEPS = [
  {
    num: "01",
    title: "Gira la Ruleta",
    desc: "Presiona el botón y participa en nuestra promoción de bienvenida. Es gratis y no requiere registro previo.",
  },
  {
    num: "02",
    title: "Descubre tu Premio",
    desc: "La ruleta se detiene y revela el beneficio exclusivo que tenemos preparado para ti.",
  },
  {
    num: "03",
    title: "Regístrate y Reclámalo",
    desc: "Completa tus datos en minutos. Tu premio queda reservado mientras lo reclamas.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative py-28 px-4 overflow-hidden"
    >
      {/* Casino background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=1600&h=700&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "blur(3px) brightness(0.25) saturate(0.6)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #080718 0%, rgba(8,7,24,0.55) 30%, rgba(8,7,24,0.55) 70%, #080718 100%)",
          }}
        />
      </div>

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

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-start justify-center gap-0">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center flex-1">
              {/* Step block */}
              <div className="flex flex-col items-center text-center px-4 md:px-6 w-full max-w-xs mx-auto">
                {/* Circle */}
                <div
                  className="relative flex items-center justify-center rounded-full mb-8 flex-shrink-0"
                  style={{
                    width: 100,
                    height: 100,
                    background: "radial-gradient(circle, rgba(30,22,80,0.95) 0%, rgba(12,9,36,0.95) 100%)",
                    border: "2px solid rgba(212,168,39,0.55)",
                    boxShadow: "0 0 30px rgba(212,168,39,0.1), inset 0 0 24px rgba(212,168,39,0.06)",
                  }}
                >
                  <span
                    className="font-black text-3xl leading-none select-none"
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
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ boxShadow: "0 0 0 8px rgba(212,168,39,0.04)" }}
                  />
                </div>

                <h3
                  className="text-xl font-bold text-white mb-3"
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-[220px]"
                  style={{ color: "rgba(237,232,252,0.5)" }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Connector line — between steps, hidden after last */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex items-center justify-center flex-shrink-0" style={{ width: 80, marginTop: "-4.5rem" }}>
                  <div
                    className="w-full h-px"
                    style={{
                      background: "linear-gradient(90deg, rgba(212,168,39,0.5), rgba(212,168,39,0.2))",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical connectors (shown only on small) */}
        <style>{`
          @media (max-width: 767px) {
            .step-block { margin-bottom: 2.5rem; }
            .step-block:not(:last-child)::after {
              content: '';
              display: block;
              width: 1px;
              height: 2rem;
              background: linear-gradient(180deg, rgba(212,168,39,0.5), rgba(212,168,39,0.1));
              margin: 0 auto;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
