import { useEffect } from "react";

/** Marca que abre el título de la pestaña. */
export const MARCA = "Mirage";

/** Escribe el título de la ventana del navegador como "Mirage | <vista>".
 *
 *  El título estático de index.html lo rellena .figma/make/site.json y solo
 *  vale hasta que React monta. A partir de ahí manda este hook, porque el
 *  título depende de la ruta y las rutas se resuelven en el cliente: sin esto
 *  la pestaña diría lo mismo en las seis vistas. */
export function useTituloVista(vista?: string) {
  useEffect(() => {
    document.title = vista ? `${MARCA} | ${vista}` : MARCA;
  }, [vista]);
}
