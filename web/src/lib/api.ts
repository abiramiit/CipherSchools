const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('.netlify.app');
const API_URL = isNetlify ? "" : (import.meta.env.VITE_API_URL || "");

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
            const body = await response.text().catch(() => '');
            throw new Error(`API Error ${response.status}: ${response.statusText} ${body ? '- ' + body : ''}`);
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
