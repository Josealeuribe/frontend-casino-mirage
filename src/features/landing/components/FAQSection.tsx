import { useState } from "react";
import { Plus } from "lucide-react";
import { SEDES } from "@/shared/data/sedes";

const NOMBRES_SEDES = SEDES.map((sede) => sede.nombre).join(" o ");

const FAQS = [
  {
    q: "¿Cómo puedo participar en Gira y Gana?",
    a: "Gira la ruleta aquí mismo, descubre tu bono y completa tu registro para reclamarlo. Tienes 3 intentos.",
  },
  {
    q: "¿Cuántos intentos tengo para girar la ruleta?",
    a: "Cada usuario tiene 3 intentos para girar la ruleta. Una vez usados todos, no podrás girar nuevamente hasta la próxima promoción.",
  },
  {
    q: "¿Qué bonos puedo ganar?",
    a: "La promoción reparte tres bonos: $10.000, $20.000 y $50.000. Todos son redimibles únicamente en nuestros casinos físicos de Arauca.",
  },
  {
    q: "¿Hasta cuándo puedo canjear mi bono?",
    a: "Tienes hasta el 30 de septiembre de 2026 para canjear tu bono. Pasada esa fecha, los bonos no canjeados quedan sin efecto.",
  },
  {
    q: "¿Dónde puedo reclamar mi bono?",
    a: `El bono se redime presencialmente en ${NOMBRES_SEDES}, sobre la Cra. 22 en Arauca. Presenta tu documento y tu código de bono en caja.`,
  },
  {
    q: "¿El bono se puede cambiar por dinero en efectivo?",
    a: "No. El bono es un beneficio de juego redimible únicamente dentro del casino y no es convertible en efectivo ni transferible a otra persona.",
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
