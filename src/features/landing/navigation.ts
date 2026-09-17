/** Las vistas publicas del sitio, en el orden en que salen en el navbar.
 *
 *  Cada entrada es una ruta propia: ya no son secciones de una misma pagina a
 *  las que se llegaba con scroll. El navbar y el footer leen esta lista, asi
 *  que agregar una vista es agregar una linea aqui mas su ruta en routes.tsx.
 *
 *  "Gira y Gana" apunta a "/" porque es el punto de entrada del cliente: al
 *  abrir el sitio lo primero que ve es la promocion. Por eso "Inicio" -- que
 *  es la informacion general del casino -- vive en "/inicio" y no en la raiz.
 *
 *  "/" solo informa (premios + como funciona + un boton); la ruleta que
 *  realmente gira vive aparte, en "/jugar". Por eso "Gira y Gana" declara
 *  `activeOn`: sin eso, al entrar a jugar el navbar dejaria de marcar
 *  cualquier opcion como activa, porque "/jugar" no coincide con ningun
 *  `to` de la lista. */
export interface NavLinkItem {
  label: string;
  to: string;
  /** Otras rutas que tambien cuentan como "estas aqui", ademas de `to`. */
  activeOn?: string[];
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Inicio",        to: "/inicio" },
  { label: "Gira y Gana",   to: "/", activeOn: ["/jugar"] },
  { label: "Premios",       to: "/premios" },
  { label: "Cómo Funciona", to: "/como-funciona" },
  { label: "Sedes",         to: "/sedes" },
  { label: "FAQ",           to: "/faq" },
];

/** Coincidencia exacta de ruta, mas las rutas extra de `activeOn`. Es
 *  deliberadamente exacta y no por prefijo: ninguna de estas vistas tiene
 *  subrutas propias salvo "Gira y Gana", que ya declara su excepcion arriba. */
export function esVistaActiva(link: NavLinkItem, pathname: string): boolean {
  return pathname === link.to || (link.activeOn?.includes(pathname) ?? false);
}
