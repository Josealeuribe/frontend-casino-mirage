export interface Sede {
  /** Clave estable para enlazar la sede con los bonos y canjes del backend
   *  cuando exista. No cambiarla aunque cambie el nombre comercial. */
  clave: string;
  nombre: string;
  /** Dirección tal como se muestra al cliente. */
  direccion: string;
  ciudad: string;
  /** [latitud, longitud] para el pin del mapa.
   *
   *  ⚠ APROXIMADAS. Están puestas sobre la Carrera 22 de Arauca para que el
   *  mapa tenga algo que dibujar, pero NO se verificaron sobre el terreno.
   *  Antes de publicar, saca las reales: abre Google Maps, clic derecho sobre
   *  la puerta del local y "Copiar coordenadas" -- pega aquí ese par tal cual. */
  coords: [number, number];
  /** Horario de atención, una línea por bloque. Opcional: hoy no está
   *  definido para ninguna sede, así que la tarjeta no lo pinta. */
  horarios?: string[];
}

export const SEDES: Sede[] = [
  {
    clave: "mirage-3",
    nombre: "Centro Club Mirage 3",
    direccion: "Cra. 22 #21-7",
    ciudad: "Arauca",
    coords: [7.0851, -70.7588],
  },
  {
    clave: "mirage-2",
    nombre: "Centro Club Mirage No. 2",
    direccion: "Cra. 22 #20-49",
    ciudad: "Arauca",
    coords: [7.0844, -70.7594],
  },
];

/** Enlace a Google Maps para "Cómo llegar".
 *
 *  Usa las coordenadas y no la dirección en texto: el buscador de Maps falla a
 *  menudo con direcciones colombianas, y un par de coordenadas nunca falla. */
export function comoLlegarUrl(sede: Sede): string {
  const [lat, lng] = sede.coords;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
