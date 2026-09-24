import { LineChart, LayoutTemplate, Activity } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';

export default function Progress() {
    const { data: attempts, isLoading, error, refetch } = useApi<any[]>('/attempts');

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;

    const concepts = [
        { name: 'SRP', val: 85 },
        { name: 'Composition', val: 70 },
        { name: 'Abstraction', val: 82 },
        { name: 'Patterns', val: 65 },
        { name: 'Interfaces', val: 92 },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto space-y-16 pb-16 animate-fade-in">
            <div className="border-b border-border pb-8 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">YOUR DESIGN JOURNEY</h1>
                <p className="text-sm font-mono text-muted tracking-wide mt-2">See how your software design thinking evolves.</p>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase flex items-center">
                    <LineChart size={14} className="mr-2" /> DESIGN SCORE HISTORY
                </h3>
                <div className="w-full h-64 bg-card border border-border rounded-xl p-6 relative overflow-hidden flex items-end">

                    {/* Simulated Graph Line */}
                    <svg className="absolute inset-x-0 bottom-6 w-full h-32 opacity-70" preserveAspectRatio="none">
                        <path d="M0 100 Q 100 50, 200 80 T 400 40 T 800 20 L 800 128 L 0 128 Z" fill="rgba(99, 102, 241, 0.05)" />
                        <path d="M0 100 Q 100 50, 200 80 T 400 40 T 800 20" stroke="#6366f1" strokeWidth="2" fill="none" />
                        <circle cx="200" cy="80" r="4" fill="#080B12" stroke="#6366f1" strokeWidth="2" />
                        <circle cx="400" cy="40" r="4" fill="#080B12" stroke="#6366f1" strokeWidth="2" />
                        <circle cx="800" cy="20" r="5" fill="#080B12" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
                    </svg>

                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(8,11,18,0.8))] pointer-events-none"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase flex items-center">
                        <Activity size={14} className="mr-2" /> CONCEPT MASTERY
                    </h3>
                    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                        {concepts.map((c) => (
                            <div key={c.name}>
                                <div className="flex justify-between items-center text-xs font-bold text-foreground font-mono uppercase mb-2">
                                    <span>{c.name}</span>
                                </div>
                                <div className="flex w-full h-2">
                                    <div className="h-full bg-accent rounded-l" style={{ width: `${c.val}%` }}></div>
                                    <div className="h-full bg-background border-y border-r border-border rounded-r flex-1" style={{ opacity: 0.5 }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase flex items-center">
                        <LayoutTemplate size={14} className="mr-2" /> PROBLEMS MASTERED
                    </h3>
                    <div className="bg-card border border-border rounded-xl px-6 py-2 overflow-y-auto custom-scrollbar h-[256px]">
                        {isLoading ? (
                            <div className="mt-4"><LoadingSkeleton lines={2} /></div>
                        ) : attempts && attempts.filter(a => a.status === 'COMPLETED').length > 0 ? (
                            attempts.filter(a => a.status === 'COMPLETED').map(a => (
                                <div key={a.id} className="py-4 border-b border-border/50 flex items-center justify-between group hover:border-accent/40 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 border border-border rounded overflow-hidden flex items-center justify-center opacity-70">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="5" width="10" height="4" stroke="#8A94A6" /><rect x="5" y="11" width="10" height="4" stroke="#6366f1" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-foreground">{a.problem?.title}</div>
                                            <div className="text-[10px] text-muted font-mono uppercase">Score: {a.score || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted text-xs font-mono">No problems mastered yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
