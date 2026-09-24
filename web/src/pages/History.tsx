import { Link } from 'react-router-dom';
import { PenTool, GitCommit, Search } from 'lucide-react';
import { ClassDiagram, EmptyArchitecture } from '../components/graphics/SystemGraphics';
import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';

export default function History() {
    const { data, isLoading, error, refetch } = useApi<any[]>('/attempts');
    const history = data ? [...data].sort((a, b) => b.id.localeCompare(a.id)) : [];

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-[800] text-[#F8FAFF] tracking-tight flex items-center">
                        <PenTool size={22} className="mr-3 text-accent" /> MY DESIGNS
                    </h1>
                    <p className="text-xs text-[#7F899B] font-mono mt-2 uppercase tracking-widest">Architectural History & Review Cache</p>
                </div>
                <div className="relative group w-full md:w-64 flex items-center">
                    <Search size={14} className="absolute left-3 text-muted group-focus-within:text-accent transition-colors" />
                    <input type="text" placeholder="Filter designs..." className="w-full bg-background border border-border py-1.5 pl-9 pr-4 text-xs text-foreground focus:outline-none focus:border-accent transition-colors rounded" />
                </div>
            </div>

            {/* Design Grid */}
            {isLoading ? (
                <LoadingSkeleton lines={4} />
            ) : history.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {history.map((h) => (
                        <div key={h.id} className="bg-card border border-border rounded-xl p-6 flex flex-col group hover:-translate-y-0.5 hover:border-accent/40 shadow-sm transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex space-x-4">
                                    <div className="w-16 h-16 bg-secondary border border-border rounded overflow-hidden flex items-center justify-center opacity-80 pt-2">
                                        <ClassDiagram title={h.problem?.title || 'System'} attributes={[]} methods={[]} width={50} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground group-hover:text-cyan transition-colors">{h.problem?.title || 'Unknown Architecture'}</h3>
                                        <div className="text-[10px] font-mono text-muted uppercase tracking-widest flex items-center mt-1">
                                            <GitCommit size={10} className="mr-1" /> Attempt #{h.id.split('-')[0]}
                                        </div>
                                    </div>
                                </div>
                                {h.status === 'COMPLETED' ? (
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold font-mono text-foreground">{h.score || 0}<span className="text-[10px] text-muted">/100</span></span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 border rounded bg-background text-muted border-border">
                                        DRAFT
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8 h-6">
                                {h.status === 'COMPLETED' ? (
                                    <>
                                        <span className="text-[10px] bg-background border border-border text-muted px-2 py-0.5 rounded font-mono">SRP</span>
                                        <span className="text-[10px] bg-background border border-border text-muted px-2 py-0.5 rounded font-mono">Strategy</span>
                                        <span className="text-[10px] bg-background border border-border text-muted px-2 py-0.5 rounded font-mono">Composition</span>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted">Working on abstractions...</span>
                                )}
                            </div>

                            <div className="mt-auto flex gap-3 border-t border-border pt-4">
                                {h.status === 'COMPLETED' ? (
                                    <>
                                        <Link to={`/feedback/${h.id}`} className="flex-1 text-center py-2 bg-elevated hover:bg-white/5 border border-border text-foreground text-xs font-bold transition-colors rounded">
                                            Review
                                        </Link>
                                        <Link to={`/practice/${h.id}`} className="flex-1 text-center py-2 bg-background hover:bg-white/5 border border-border text-foreground text-xs font-bold transition-colors rounded group-hover:text-accent">
                                            Retry
                                        </Link>
                                    </>
                                ) : (
                                    <Link to={`/practice/${h.id}`} className="flex-1 text-center py-2 bg-accent hover:bg-accent-light border border-accent text-white text-xs font-bold transition-colors shadow rounded">
                                        Continue Design →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyArchitecture
                    message="No designs initiated yet."
                    cta="Draft First Design"
                    onAction={() => window.location.href = '/problems'}
                />
            )}
        </div>
    );
}
