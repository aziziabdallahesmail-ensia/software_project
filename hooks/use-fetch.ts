import { useCallback, useState } from "react";
import { toast } from "sonner";

type UseFetchResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>;
};

const useFetch = <T,>(callback: (...args: any[]) => Promise<T>): UseFetchResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // `execute` must keep a stable identity across renders: callers put it in
  // useEffect dependency arrays, and a fresh function each render re-fires the
  // effect, which sets state, which renders again — an endless request loop.
  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const response = await callback(...args);
        setData(response);
        setError(null);
      } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error(String(error));
        setError(errorInstance);
        toast.error(errorInstance.message);
      } finally {
        setLoading(false);
      }
    },
    [callback]
  );

  return { data, loading, error, execute, setData };
};

export default useFetch;
