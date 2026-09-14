/** Desplaza suavemente hasta una sección de la landing. La usan el navbar y el
 *  footer, así que vive aquí para que ambos naveguen igual. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
