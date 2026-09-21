import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { adminFetchClientes, type AdminCliente } from "@/shared/api/client";
import { useAdminFetch } from "../useAdminFetch";
import { AdminCargando, AdminError } from "../AdminStates";
import { descargarExcel, type ColumnaExcel } from "../excelExport";
import Paginador, { REGISTROS_POR_PAGINA } from "../Paginador";

const card: React.CSSProperties = {
  background: "#0E0B28",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "0.875rem",
  overflow: "hidden",
};

// timeZone fija a Colombia -- ver la misma nota en admin/modules/VistaGeneral.tsx.
function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" });
}

function formatFechaHora(fecha: string | null) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleString("es-CO", { timeZone: "America/Bogota" });
}

const COLUMNAS_CLIENTES: ColumnaExcel[] = [
  { header: "ID", key: "id", width: 8 },
  { header: "Nombres", key: "nombres", width: 18 },
  { header: "Apellidos", key: "apellidos", width: 18 },
  { header: "Tipo de documento", key: "docTipo", width: 20 },
  { header: "Número de documento", key: "docNumero", width: 18 },
  { header: "Fecha de nacimiento", key: "nacimiento", width: 16 },
  { header: "Teléfono", key: "telefono", width: 14 },
  { header: "Departamento", key: "departamento", width: 20 },
  { header: "Ciudad", key: "ciudad", width: 16 },
  { header: "Email", key: "email", width: 26 },
  { header: "Fecha de registro", key: "registro", width: 20 },
  { header: "Código de bono", key: "codigoBono", width: 18 },
  { header: "Premio", key: "premio", width: 16 },
  { header: "Valor del premio", key: "valor", width: 16, currency: true },
  { header: "Estado del bono", key: "estadoBono", width: 16 },
  { header: "Sede asignada", key: "sedeAsignada", width: 22 },
  { header: "Sede de redención", key: "sede", width: 22 },
  { header: "Fecha de canje", key: "fechaCanje", width: 20 },
];

// Exporta absolutamente todo lo que el backend sabe de cada cliente, no solo
// las columnas que caben en la tabla de pantalla (esta pidió explícitamente
// "toda la información... toda en general").
async function exportarClientes(clientes: AdminCliente[]) {
  const filas = clientes.map((c) => ({
    id: c.id,
    nombres: c.nombres,
    apellidos: c.apellidos,
    docTipo: c.docTipo,
    docNumero: c.docNumero,
    nacimiento: formatFecha(c.nacimiento),
    telefono: c.telefono,
    departamento: c.departamento,
    ciudad: c.ciudad,
    email: c.email,
    registro: formatFechaHora(c.createdAt),
    codigoBono: c.bono?.codigo ?? "",
    premio: c.bono?.premio.nombre ?? "",
    valor: c.bono ? c.bono.premio.monto : "",
    estadoBono: c.bono ? (c.bono.estado === "reclamado" ? "Canjeado" : "Pendiente") : "Sin bono",
    sedeAsignada: c.bono?.sedeAsignada ?? "",
    sede: c.bono?.sede ?? "",
    fechaCanje: formatFechaHora(c.bono?.canjeadoEn ?? null),
  }));
  await descargarExcel(`clientes-centro-club-mirage-${new Date().toISOString().slice(0, 10)}.xlsx`, "Clientes", COLUMNAS_CLIENTES, filas);
}

export default function Clientes() {
  const { data, loading, error } = useAdminFetch(adminFetchClientes);
  const [search, setSearch] = useState("");
  const [exportando, setExportando] = useState(false);
  const [pagina, setPagina] = useState(1);

  // Buscar cambia el conjunto filtrado -- si no se vuelve a la pagina 1, una
  // busqueda hecha desde la pagina 4 podria mostrar "sin resultados" aunque
  // si los haya, solo que en una pagina que ya no existe para ese filtro.
  useEffect(() => {
    setPagina(1);
  }, [search]);

  if (loading) return <AdminCargando />;
  if (error) return <AdminError message={error} />;
  if (!data) return null;

  const clientes = data.clientes;
  const filtered = clientes.filter((c) => {
    const nombreCompleto = `${c.nombres} ${c.apellidos}`.toLowerCase();
    return nombreCompleto.includes(search.toLowerCase()) || c.docNumero.includes(search);
  });
  const totalPaginas = Math.max(1, Math.ceil(filtered.length / REGISTROS_POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtered.slice((paginaSegura - 1) * REGISTROS_POR_PAGINA, paginaSegura * REGISTROS_POR_PAGINA);

  const handleExportar = async () => {
    setExportando(true);
    try {
      await exportarClientes(clientes);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(237,232,252,0.4)" }}>
            {clientes.length} clientes registrados en la promoción
          </p>
        </div>
        <button
          onClick={handleExportar}
          disabled={clientes.length === 0 || exportando}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(237,232,252,0.6)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <Download size={13} />
          {exportando ? "Generando..." : "Descargar Excel"}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(237,232,252,0.3)" }} />
        <input
          type="text"
          placeholder="Buscar por nombre o documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm outline-none rounded-xl"
          style={{
            background: "#0E0B28",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(237,232,252,0.8)",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(107,50,214,0.45)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
        />
      </div>

      {/* Table */}
      <div style={card}>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: "#0C0924" }}>
            <tr>
              {["#", "Nombre", "Documento", "Sede asignada", "Bono", "Estado", "Fecha"].map((h) => (
                <th key={h} className="text-left text-xs font-medium px-4 py-3 uppercase tracking-wider" style={{ color: "rgba(237,232,252,0.3)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginados.map((c, i) => {
              const estado = c.bono?.estado === "reclamado" ? "Canjeado" : c.bono ? "Pendiente" : "Sin bono";
              const estadoStyle =
                estado === "Canjeado"
                  ? { background: "rgba(16,185,129,0.1)", color: "#34D399", border: "1px solid rgba(16,185,129,0.15)" }
                  : estado === "Pendiente"
                  ? { background: "rgba(212,168,39,0.1)", color: "#D4A827", border: "1px solid rgba(212,168,39,0.18)" }
                  : { background: "rgba(100,116,139,0.1)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.15)" };
              // Numero de fila propio del aplicativo, no el id de la base de
              // datos -- consecutivo dentro del listado ya filtrado, y sigue
              // subiendo entre paginas (pagina 2 empieza en 21, no en 1 otra vez).
              const numero = (paginaSegura - 1) * REGISTROS_POR_PAGINA + i + 1;
              return (
                <tr
                  key={c.id}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  className="transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(107,50,214,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.25)" }}>{numero}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "rgba(237,232,252,0.85)" }}>{c.nombres} {c.apellidos}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.docNumero}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.4)" }}>{c.bono?.sedeAsignada ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: "#D4A827" }}>
                    {c.bono ? `$${c.bono.premio.monto.toLocaleString("es-CO")}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={estadoStyle}>
                      {estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(237,232,252,0.3)" }}>{formatFecha(c.createdAt)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(237,232,252,0.28)" }}>
                  Sin resultados para "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        <Paginador
          pagina={paginaSegura}
          totalPaginas={totalPaginas}
          totalItems={filtered.length}
          porPagina={REGISTROS_POR_PAGINA}
          onCambiar={setPagina}
        />
      </div>
    </div>
  );
}
