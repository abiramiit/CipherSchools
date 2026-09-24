import { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

export function useApi<T>(endpoint: string) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = async () => {
        setIsLoading(true);
        setError(null);

        const result = await fetchApi(endpoint);
        if (result.error) {
            setError(result.error);
            setData(null);
        } else {
            setData(result.data);
            setError(null);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!endpoint) return;
        refetch();
    }, [endpoint]);

    return { data, isLoading, error, refetch };
}
