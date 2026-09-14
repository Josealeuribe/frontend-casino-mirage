export interface Sede {
  /** Clave estable para enlazar la sede con los bonos y canjes del backend
   *  cuando exista. No cambiarla aunque cambie el nombre comercial. */
  clave: string;
  nombre: string;
  /** Dirección tal como se muestra al cliente. */
  direccion: string;
  ciudad: string;
}

export const SEDES: Sede[] = [
  {
    clave: "mirage-3",
    nombre: "Centro Club Mirage 3",
    direccion: "Cra. 22 #21-7",
    ciudad: "Arauca",
  },
  {
    clave: "mirage-2",
    nombre: "Centro Club Mirage No. 2",
    direccion: "Cra. 22 #20-49",
    ciudad: "Arauca",
  },
];

/** Enlace a Google Maps para "Cómo llegar".
 *
 *  Se arma como búsqueda por dirección en texto. Si más adelante quieres
 *  precisión exacta (el buscador de Maps a veces no acierta con direcciones
 *  colombianas), agrega `coords: [lat, lng]` a la sede y cambia el destino por
 *  `?api=1&destination=${lat},${lng}`: un par de coordenadas nunca falla. */
export function comoLlegarUrl(sede: Sede): string {
  const consulta = `${sede.direccion}, ${sede.ciudad}, Colombia`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}
