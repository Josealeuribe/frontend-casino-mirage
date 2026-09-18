import { useEffect, useRef } from "react";
import { Howl } from "howler";
import sonidoGiro from "@/imports/ruleta-giro.wav";
import sonidoPremio from "@/imports/ruleta-premio.wav";

// El loop de "giro" es un tren de clics parejo (ver el script que lo generó,
// scratchpad/generar-sonidos.mjs) -- la sensación de que la ruleta acelera y
// frena la da EXCLUSIVAMENTE la velocidad de reproducción (`rate`), que aquí
// se sincroniza con la misma curva de desaceleración que ya usa la rueda 3D
// (easeOutQuint, ver Roulette3D.tsx). Es la derivada de esa curva -- la
// "velocidad angular" -- normalizada a [0,1]: 1 al arrancar, 0 al frenar del
// todo. easeOutQuint(t) = 1-(1-t)^5, su derivada es 5*(1-t)^4, y (1-t)^4 es
// esa misma forma ya normalizada (sin el factor 5).
function velocidadNormalizada(progreso: number): number {
  const t = Math.min(1, Math.max(0, progreso));
  return Math.pow(1 - t, 4);
}

const RATE_MIN = 0.45;
const RATE_MAX = 1.9;

export function useRuletaSonido() {
  const loopRef = useRef<Howl | null>(null);
  const premioRef = useRef<Howl | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    loopRef.current = new Howl({ src: [sonidoGiro], loop: true, volume: 0 });
    premioRef.current = new Howl({ src: [sonidoPremio], volume: 0.55 });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      loopRef.current?.unload();
      premioRef.current?.unload();
    };
  }, []);

  // Arranca el loop en cuanto se confirma el giro (mismo instante en que la
  // rueda 3D empieza a animarse) y va bajando su velocidad de reproducción
  // cuadro a cuadro durante toda `durationMs`, seana la misma duración que
  // recibe Roulette3D.
  const iniciarGiro = (durationMs: number) => {
    const loop = loopRef.current;
    if (!loop) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    loop.stop();
    loop.rate(RATE_MAX);
    loop.volume(0.5);
    loop.play();

    const inicio = performance.now();
    const tick = () => {
      const progreso = (performance.now() - inicio) / durationMs;
      const rate = RATE_MIN + (RATE_MAX - RATE_MIN) * velocidadNormalizada(progreso);
      loop.rate(rate);
      if (progreso < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Se llama justo cuando la ruleta 3D avisa que la bola ya cayó en su
  // casillero (onSpinComplete de Roulette3D, el mismo instante en que
  // RuletaPage revela el premio) -- el sonido de giro para exactamente ahí,
  // nunca antes ni después, y el de premio suena una sola vez.
  const detenerGiro = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const loop = loopRef.current;
    if (loop?.playing()) loop.fade(loop.volume(), 0, 150);
    setTimeout(() => loop?.stop(), 160);
  };

  const reproducirPremio = () => {
    premioRef.current?.play();
  };

  return { iniciarGiro, detenerGiro, reproducirPremio };
}
