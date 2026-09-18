import { useEffect, useState } from "react";

/** Cuenta regresiva en vivo hacia un instante fijo (epoch ms). Nace del
 *  ticket de premio de la ruleta: tiene 30 minutos de vigencia (ver
 *  TICKET_TTL_MINUTES en el backend) y hay que mostrarle a quien gano
 *  cuanto le queda de verdad para registrarse, no solo un aviso estatico de
 *  "30 minutos" que no refleja cuanto ya paso.
 *
 *  `expiraEnMs` null significa "sin cuenta regresiva que mostrar" (por
 *  ejemplo, un registro sin premio de por medio). */
export function useCuentaRegresiva(expiraEnMs: number | null) {
  const [restanteMs, setRestanteMs] = useState(() => (expiraEnMs ? expiraEnMs - Date.now() : null));

  useEffect(() => {
    if (expiraEnMs == null) {
      setRestanteMs(null);
      return;
    }
    setRestanteMs(expiraEnMs - Date.now());
    const id = setInterval(() => setRestanteMs(expiraEnMs - Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiraEnMs]);

  if (restanteMs == null) return { restanteMs: null, expirado: false, etiqueta: null };

  const expirado = restanteMs <= 0;
  const totalSegundos = Math.max(0, Math.floor(restanteMs / 1000));
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  const etiqueta = `${minutos}:${String(segundos).padStart(2, "0")}`;

  return { restanteMs, expirado, etiqueta };
}
