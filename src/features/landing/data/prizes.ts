export interface Prize {
  id: number;
  name: string;
  /** Valor del bono en pesos. Sirve para agrupar y sumar sin volver a parsear
   *  el nombre en el panel administrativo. */
  amount: number;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: string;
  weight: number;
}

/** Los tres únicos bonos de la promoción. Cualquier otro premio que aparezca
 *  en pantalla tiene que salir de aquí: la ruleta, la sección de premios y el
 *  modal de resultado leen esta misma lista. */
export const PRIZES: Prize[] = [
  {
    id: 1,
    name: "Bono de $10.000",
    amount: 10000,
    desc: "Redimible únicamente en nuestras sedes físicas de Arauca, presentando tu documento en caja.",
    badge: "MÁS COMÚN",
    badgeColor: "#D4A827",
    icon: "coin",
    weight: 55,
  },
  {
    id: 2,
    name: "Bono de $20.000",
    amount: 20000,
    desc: "Redimible únicamente en nuestras sedes físicas de Arauca, presentando tu documento en caja.",
    badge: "MÁS POPULAR",
    badgeColor: "#D4A827",
    icon: "gift",
    weight: 32,
  },
  {
    id: 3,
    name: "Bono de $50.000",
    amount: 50000,
    desc: "Nuestro bono de bienvenida mayor, redimible únicamente en nuestras sedes físicas de Arauca.",
    badge: "PREMIO MAYOR",
    badgeColor: "#D4A827",
    icon: "trophy",
    weight: 13,
  },
];

export function pickPrize(): Prize {
  const total = PRIZES.reduce((a, p) => a + p.weight, 0);
  let r = Math.random() * total;
  for (const prize of PRIZES) {
    r -= prize.weight;
    if (r <= 0) return prize;
  }
  return PRIZES[0];
}
