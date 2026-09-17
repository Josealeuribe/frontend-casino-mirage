import { useEffect, useState } from "react";
import { ApiError } from "@/shared/api/client";

/**
 * Pequeño hook compartido para los módulos del panel admin: dispara
 * `fetchFn` al montar (o cuando cambian `deps`), expone el resultado
 * tipado, un flag de carga y un mensaje de error legible.
 */
export function useAdminFetch<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((result) => {
        if (alive) setData(result);
      })
      .catch((err) => {
        if (alive) setError(err instanceof ApiError ? err.message : "No se pudo cargar la información. Intenta de nuevo.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData, setError };
}
