const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    try {
        const url = `${API_URL}/api${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
