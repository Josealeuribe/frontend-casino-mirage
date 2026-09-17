import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SEDES, comoLlegarUrl, type Sede } from "@/shared/data/sedes";

/** Pin dorado dibujado en HTML.
 *
 *  Se usa divIcon y no el marcador por defecto de Leaflet a propósito: ese
 *  apunta a unos PNG que Leaflet resuelve por ruta relativa, y con un bundler
 *  -- y encima bajo el subpath /arauca -- acaban en 404. Un div no depende de
 *  ningún archivo, y de paso queda con la paleta del sitio. */
const pinDorado = L.divIcon({
  className: "",
  html: `<span style="
    display:block; width:18px; height:18px; border-radius:9999px;
    background:#D4A827; border:3px solid #0E0B28;
    box-shadow:0 0 0 2px rgba(212,168,39,0.45), 0 2px 6px rgba(0,0,0,0.5);
  "></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function MapaSedes() {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef<Record<string, L.Marker>>({});
  const [activa, setActiva] = useState(SEDES[0]?.clave);

  useEffect(() => {
    if (!contenedor.current || mapa.current) return;

    const m = L.map(contenedor.current, { scrollWheelZoom: false });
    mapa.current = m;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);

    for (const sede of SEDES) {
      const marcador = L.marker(sede.coords, { icon: pinDorado, title: sede.nombre })
        .addTo(m)
        .bindPopup(`<strong>${sede.nombre}</strong><br>${sede.direccion}`);
      marcador.on("click", () => setActiva(sede.clave));
      marcadores.current[sede.clave] = marcador;
    }

    // Encuadre que abarca todas las sedes. maxZoom evita que con dos locales
    // tan cercanos el mapa se acerque tanto que no se reconozca la ciudad.
    m.fitBounds(L.latLngBounds(SEDES.map((s) => s.coords)).pad(0.5), { maxZoom: 16 });

    return () => {
      m.remove();
      mapa.current = null;
      marcadores.current = {};
    };
  }, []);

  const enfocar = (sede: Sede) => {
    setActiva(sede.clave);
    mapa.current?.flyTo(sede.coords, 17, { duration: 0.6 });
    marcadores.current[sede.clave]?.openPopup();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      {/* Leaflet necesita que el contenedor tenga alto propio: con height auto
          el mapa se monta en 0px y no se ve nada.

          `isolate` (isolation: isolate) es lo que impide que el mapa se monte
          sobre el navbar al hacer scroll: Leaflet declara z-index hasta 1000
          en sus paneles y controles, y el navbar es z-40. Sin un contexto de
          apilamiento propio ambos compiten en el mismo, y gana el mapa.
          Aislando el contenedor, esos z-index solo valen puertas adentro. */}
      <div
        ref={contenedor}
        className="isolate h-[380px] w-full overflow-hidden rounded-2xl lg:h-[440px]"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#0E0B28" }}
      />

      {/* Centrado: con dos sedes y sin horarios la columna es mas corta que el
          mapa, y alineada arriba dejaba un hueco raro debajo. */}
      <div className="flex flex-col justify-center gap-4">
        {SEDES.map((sede) => {
          const esActiva = sede.clave === activa;
          return (
            <div
              key={sede.clave}
              onClick={() => enfocar(sede)}
              className="cursor-pointer rounded-2xl p-5 transition-all duration-300"
              style={{
                background: "rgba(14,11,40,0.8)",
                border: esActiva
                  ? "1px solid rgba(212,168,39,0.45)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: esActiva ? "0 0 28px rgba(212,168,39,0.1)" : "none",
              }}
            >
              <h3 className="text-lg font-bold" style={{ color: "#D4A827" }}>
                {sede.nombre}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "rgba(237,232,252,0.55)" }}>
                {sede.direccion} · {sede.ciudad}
              </p>

              {sede.horarios?.map((linea) => (
                <p
                  key={linea}
                  className="mt-2 flex items-center gap-2 text-xs"
                  style={{ color: "rgba(237,232,252,0.45)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M6 3.4V6l1.7 1.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                  {linea}
                </p>
              ))}

              <a
                href={comoLlegarUrl(sede)}
                target="_blank"
                rel="noopener noreferrer"
                // El clic en el enlace no debe además reencuadrar el mapa.
                onClick={(e) => e.stopPropagation()}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold underline underline-offset-4"
                style={{ color: "#D4A827" }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M11.5 1.5L7.5 11.5 6 7 1.5 5.5 11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                Cómo llegar
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
