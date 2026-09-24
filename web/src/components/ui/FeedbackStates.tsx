import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ApiErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
    const isLocal = import.meta.env.MODE === 'development' || import.meta.env.VITE_API_URL?.includes('localhost');
    const errorMessage = isLocal
        ? `DesignForge couldn't connect to the local API. Ensure the backend server is running on port 3001. (${error})`
        : `DesignForge couldn't connect to the backend service. Please try again in a moment.`;

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full w-full animate-fade-in my-auto">
            <div className="w-16 h-16 bg-error/10 border border-error/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={28} className="text-error" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Backend Unavailable</h3>
            <p className="text-sm text-secondary max-w-sm mb-6 leading-relaxed">
                {errorMessage}
            </p>
            <button
                onClick={onRetry}
                className="flex items-center space-x-2 bg-card hover:bg-cardHover border border-border px-5 py-2.5 rounded-md text-sm font-bold text-foreground transition-all active:scale-95 shadow-sm"
            >
                <RefreshCw size={14} className="text-muted" />
                <span>Retry Connection</span>
            </button>
        </div>
    );
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="w-full space-y-4 animate-pulse p-6">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-24 bg-card border border-border rounded-xl w-full opacity-60"></div>
            ))}
        </div>
    );
}
