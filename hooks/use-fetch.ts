import { useState } from "react";
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

  const execute = async (...args: any[]) => {
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
  };

  return { data, loading, error, execute, setData };
};

export default useFetch;