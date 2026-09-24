import { useParams, Link } from 'react-router-dom';
import { ScoreRing } from '../components/graphics/SystemGraphics';
import { Check, AlertTriangle, ArrowRight, CornerDownRight, Code2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';

export default function Feedback() {
    const { id } = useParams();
    const { data, isLoading, error, refetch } = useApi<any>(`/attempts/${id}`);

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;

    const result = data?.attempt;
    if (isLoading || !result) return <div className="p-8 text-center animate-pulse"><LoadingSkeleton lines={4} /></div>;

    const dummyMetrics = {
        Responsibility: { score: Math.min(100, (result.score || 0) + 6), desc: 'Single responsibility & allocation' },
        Abstraction: { score: Math.max(0, (result.score || 0) - 3), desc: 'Information hiding & interfaces' },
        Extensibility: { score: Math.min(100, (result.score || 0) + 2), desc: 'Open-closed principle adherence' },
        Patterns: { score: Math.max(0, (result.score || 0) - 6), desc: 'Appropriate structural patterns' },
        Relationships: { score: result.score || 0, desc: 'Composition vs inheritance usage' }
    };

    return (
        <div className="w-full max-w-5xl mx-auto pb-20 animate-fade-in">
            {/* Header */}
            <div className="mb-12 border-b border-border pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-mono font-bold uppercase tracking-widest text-muted mb-2 flex items-center">
                        <Code2 size={14} className="mr-2" /> DESIGN REVIEW
                    </h1>
                    <h2 className="text-3xl font-extrabold text-foreground">{result.problem?.title}</h2>
                </div>
                <Link to="/attempts" className="text-xs text-muted font-mono font-bold hover:text-foreground transition-colors border border-border px-3 py-1.5 rounded">
                    ← Back to Designs
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left: Overall Quality Breakdown */}
                <div className="w-full lg:w-1/3 space-y-10 shrink-0 sticky top-24">
                    <div className="flex flex-col items-center p-8 bg-elevated border border-border rounded-xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[40px] opacity-70"></div>
                        <ScoreRing score={result.score || 0} size={140} />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-mono font-bold tracking-widest text-muted uppercase">Architecture Breakdown</h3>
                        {Object.entries(dummyMetrics).map(([key, val]) => (
                            <div key={key} className="space-y-2 group">
                                <div className="flex justify-between items-center text-xs font-bold text-foreground font-mono uppercase">
                                    <span>{key}</span>
                                    <span className="text-cyan">{val.score}/100</span>
                                </div>
                                <div className="h-2 w-full bg-background border border-border rounded-full overflow-hidden p-0.5">
                                    <div className="h-full bg-accent rounded-full transition-all duration-1000 group-hover:bg-cyan" style={{ width: `${val.score}%` }}></div>
                                </div>
                                <p className="text-[10px] text-muted">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Code Review Findings */}
                <div className="flex-1 w-full space-y-6">
                    <h3 className="text-[10px] font-mono font-bold tracking-widest text-muted uppercase border-b border-border pb-3">Reviewer Feedback</h3>

                    {/* Strong Design Point */}
                    <div className="relative pl-8 pb-4">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/20"></div>
                        <div className="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-background border-2 border-accent"></div>

                        <div className="bg-card border border-border rounded-lg p-6 lg:p-8 hover:border-accent/30 transition-colors shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-80"></div>
                            <div className="flex items-center space-x-3 mb-4">
                                <Check size={18} className="text-accent" />
                                <h4 className="text-sm font-bold text-foreground tracking-wide">STRONG DESIGN</h4>
                            </div>
                            <p className="text-sm text-foreground/90 font-mono leading-relaxed bg-background p-4 rounded border border-border/50">
                                Parking allocation is separated from the core ParkingLot responsibility. Clean abstractions detected.
                            </p>
                        </div>
                    </div>

                    {/* Improvement Point */}
                    <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-cyan/20"></div>
                        <div className="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-background border-2 border-cyan"></div>

                        <div className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan opacity-80"></div>
                            <div className="flex items-center space-x-3 mb-4">
                                <AlertTriangle size={18} className="text-cyan" />
                                <h4 className="text-sm font-bold text-foreground tracking-wide">IMPROVEMENT REQUIRED</h4>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-foreground/90 font-mono leading-relaxed bg-background p-4 rounded border border-border/50">
                                    ParkingLot currently handles rigid pricing logic directly within the exit routine.
                                </p>

                                <div className="flex space-x-3 mt-4 pt-4 border-t border-border">
                                    <div className="flex-1">
                                        <h5 className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Why This Matters</h5>
                                        <p className="text-xs text-muted leading-relaxed">
                                            A pricing change or a new vehicle category would require modifying the primary lot management class, violating OCP.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-background border border-cyan/20 rounded-md p-4">
                                    <h5 className="text-[10px] uppercase font-bold tracking-widest text-cyan mb-2 flex items-center"><CornerDownRight size={12} className="mr-1" /> Consider</h5>
                                    <p className="text-xs text-foreground/80 font-mono font-bold">
                                        Extract a <span className="text-cyan">`PricingStrategy`</span> interface and inject into checkout.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generic details dump */}
                    <div className="relative pl-8">
                        <div className="absolute left-[-5px] top-1 w-[11px] h-[11px] rounded-full bg-background border-2 border-muted"></div>
                        <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-between">
                            <span className="text-xs text-muted font-mono uppercase">Raw Evaluator Log</span>
                            <button className="text-[10px] uppercase font-bold text-accent hover:text-accent-light transition-colors font-mono">Expand ↓</button>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <Link to={`/practice/${id}`} className="bg-foreground text-background px-6 py-2.5 rounded font-bold text-sm shadow hover:bg-white transition-colors cursor-pointer inline-flex items-center">
                            Return to Editor <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
