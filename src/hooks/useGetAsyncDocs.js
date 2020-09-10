import { useState, useCallback } from "react";

export function useGetAsyncDocs(fn) {
  const [response, setResponse] = useState(null);
  const getLatestDocs = useCallback(() => {
    return fn()
      .then((response) => {
        setResponse(response);
      })
      .catch((error) => {});
  }, [fn]);

  return { getLatestDocs, response };
}
