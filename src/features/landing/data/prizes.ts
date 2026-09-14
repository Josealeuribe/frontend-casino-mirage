export interface Prize {
  id: number;
  name: string;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: string;
  weight: number;
}

export const PRIZES: Prize[] = [
  {
    id: 1,
    name: "Bono de $5.000",
    desc: "Bono redimible en cualquiera de nuestras 3 sedes al completar tu registro.",
    badge: "FÁCIL DE GANAR",
    badgeColor: "#D4A827",
    icon: "coin",
    weight: 30,
  },
  {
    id: 2,
    name: "Bono de $10.000",
    desc: "Bono redimible en cualquiera de nuestras 3 sedes al completar tu registro.",
    badge: "MÁS COMÚN",
    badgeColor: "#D4A827",
    icon: "card",
    weight: 25,
  },
  {
    id: 3,
    name: "Bono de $20.000",
    desc: "Bono redimible en cualquiera de nuestras 3 sedes al completar tu registro.",
    badge: "MÁS POPULAR",
    badgeColor: "#D4A827",
    icon: "gift",
    weight: 20,
  },
  {
    id: 4,
    name: "Cartón de Bingo Premium",
    desc: "Para el próximo evento en vivo del club, canjeable en caja.",
    badge: "NUEVO",
    badgeColor: "#D4A827",
    icon: "layers",
    weight: 12,
  },
  {
    id: 5,
    name: "Entrada a Evento Especial",
    desc: "Acceso a nuestro próximo evento especial en sede.",
    badge: "VIP",
    badgeColor: "#D4A827",
    icon: "ticket",
    weight: 8,
  },
  {
    id: 6,
    name: "Bono de $50.000",
    desc: "Nuestro bono de bienvenida mayor, redimible en sede al completar tu registro.",
    badge: "PREMIO MAYOR",
    badgeColor: "#D4A827",
    icon: "trophy",
    weight: 3,
  },
  {
    id: 7,
    name: "Premio Sorpresa",
    desc: "Una cortesía especial de Mirage Casino, disponible en sede.",
    badge: "PREMIUM",
    badgeColor: "#D4A827",
    icon: "party",
    weight: 2,
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
