export interface Prize {
  id: number;
  name: string;
  /** Valor del bono en pesos. */
  amount: number;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: string;
}

/** Catálogo informativo que se muestra ANTES de girar (sección de premios,
 *  landing de "Gira y Gana"). Los valores son los mismos que el backend
 *  siembra en la tabla `premios` (ver backend/prisma/seed.ts) — si cambia
 *  uno, debe cambiar el otro.
 *
 *  El premio real de cada giro ya NO sale de aquí: lo decide el servidor
 *  (POST /api/ruleta/girar-anonimo). Este archivo solo aporta el icono y el
 *  color de cada bono, mapeados por `clave`, para pintar el resultado que
 *  llega de la API (ver mapPremioToPrize más abajo). */
export const PRIZES: Prize[] = [
  {
    id: 1,
    name: "Bono de $10.000",
    amount: 10000,
    desc: "Redimible únicamente en nuestras sedes físicas de Arauca, presentando tu documento en caja.",
    badge: "MÁS COMÚN",
    badgeColor: "#D4A827",
    icon: "coin",
  },
  {
    id: 2,
    name: "Bono de $20.000",
    amount: 20000,
    desc: "Redimible únicamente en nuestras sedes físicas de Arauca, presentando tu documento en caja.",
    badge: "MÁS POPULAR",
    badgeColor: "#D4A827",
    icon: "gift",
  },
  {
    id: 3,
    name: "Bono de $50.000",
    amount: 50000,
    desc: "Nuestro bono de bienvenida mayor, redimible únicamente en nuestras sedes físicas de Arauca.",
    badge: "PREMIO MAYOR",
    badgeColor: "#D4A827",
    icon: "trophy",
  },
];

export const ICONO_POR_CLAVE: Record<string, string> = {
  "bono-10000": "coin",
  "bono-20000": "gift",
  "bono-50000": "trophy",
};

const BADGE_POR_CLAVE: Record<string, string> = {
  "bono-10000": "MÁS COMÚN",
  "bono-20000": "MÁS POPULAR",
  "bono-50000": "PREMIO MAYOR",
};

/** Convierte el premio que devuelve la API (autoridad real: lo sorteó el
 *  servidor) en el shape visual que ya sabían pintar PrizeRevealModal y el
 *  resto de componentes de esta carpeta. */
export function mapPremioToPrize(premio: { clave: string; nombre: string; detalle: string; monto: number }): Prize {
  return {
    id: 0,
    name: premio.nombre,
    amount: premio.monto,
    desc: premio.detalle,
    badge: BADGE_POR_CLAVE[premio.clave] ?? "PREMIO",
    badgeColor: "#D4A827",
    icon: ICONO_POR_CLAVE[premio.clave] ?? "coin",
  };
}
