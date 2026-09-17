// Exportador .xlsx compartido por los módulos del panel admin que ofrecen
// "descargar" una tabla completa (Clientes, Auditoría de Canjes...).
//
// `exceljs` se importa de forma dinámica (import() en vez de import estático)
// para que su código (~900 KB) no infle el bundle principal: solo se
// descarga la primera vez que alguien realmente hace clic en "Descargar
// Excel", no en cada carga del panel.

export interface ColumnaExcel {
  header: string;
  key: string;
  width?: number;
  /** Formatea la celda como moneda ($#.##0) cuando el valor es numérico. */
  currency?: boolean;
}

const MORADO = "FF6B32D6";
const MORADO_OSCURO = "FF2A2050";
const DORADO = "FFD4A827";
const GRIS_CLARO = "FFF5F3FA";
const BORDE = "FFE5E7EB";

export async function descargarExcel(
  nombreArchivo: string,
  titulo: string,
  columnas: ColumnaExcel[],
  filas: Record<string, string | number | null>[],
) {
  const ExcelJS = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "Centro Club Mirage";
  wb.created = new Date();

  const ws = wb.addWorksheet(titulo.slice(0, 31) || "Datos");
  const totalCols = columnas.length;

  ws.columns = columnas.map((c) => ({ key: c.key, width: c.width ?? Math.max(12, c.header.length + 2) }));

  // Fila 1: título de marca, en toda la fila.
  ws.mergeCells(1, 1, 1, totalCols);
  const tituloCelda = ws.getCell(1, 1);
  tituloCelda.value = `${titulo} — Centro Club Mirage`;
  tituloCelda.font = { bold: true, size: 15, color: { argb: "FFFFFFFF" } };
  tituloCelda.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MORADO } };
  tituloCelda.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 30;

  // Fila 2: subtítulo -- fecha de generación y total de registros, para que
  // el archivo se explique solo sin depender de quien lo comparta después.
  ws.mergeCells(2, 1, 2, totalCols);
  const subtituloCelda = ws.getCell(2, 1);
  subtituloCelda.value = `Generado el ${new Date().toLocaleString("es-CO")} · ${filas.length} registro${filas.length === 1 ? "" : "s"}`;
  subtituloCelda.font = { italic: true, size: 10, color: { argb: "FF6B7280" } };
  subtituloCelda.alignment = { vertical: "middle", indent: 1 };
  ws.getRow(2).height = 20;

  // Fila 3: encabezados de columna.
  const filaEncabezado = 3;
  columnas.forEach((c, i) => {
    const cell = ws.getCell(filaEncabezado, i + 1);
    cell.value = c.header;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MORADO_OSCURO } };
    cell.border = { bottom: { style: "medium", color: { argb: DORADO } } };
    cell.alignment = { vertical: "middle", indent: 1 };
  });
  ws.getRow(filaEncabezado).height = 22;

  // Filas de datos, con bandas alternadas para que se lean facil en tablas
  // largas, y formato de moneda en las columnas marcadas como `currency`.
  filas.forEach((fila, idx) => {
    const rowIndex = filaEncabezado + 1 + idx;
    const row = ws.getRow(rowIndex);
    columnas.forEach((c, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      const valor = fila[c.key];
      cell.value = valor === null ? "" : valor;
      if (c.currency && typeof valor === "number") {
        cell.numFmt = '"$"#,##0';
      }
      cell.border = { bottom: { style: "thin", color: { argb: BORDE } } };
      cell.alignment = { vertical: "middle", indent: 1 };
    });
    if (idx % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRIS_CLARO } };
      });
    }
  });

  // Encabezado fijo al hacer scroll + filtro/orden por columna, como
  // cualquier planilla profesional.
  ws.views = [{ state: "frozen", ySplit: filaEncabezado }];
  ws.autoFilter = { from: { row: filaEncabezado, column: 1 }, to: { row: filaEncabezado, column: totalCols } };

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
