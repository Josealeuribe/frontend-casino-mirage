import MapaSedes from "@/shared/components/MapaSedes";

/** Reutiliza el mismo mapa Leaflet (con pines reales) que ya se ve en el
 *  sitio público -- no se reinventa uno nuevo para el panel de cliente. */
export default function Sedes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sedes</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
          Puedes redimir tu bono en cualquiera de nuestras 2 sedes en Arauca
        </p>
      </div>
      <MapaSedes />
    </div>
  );
}
