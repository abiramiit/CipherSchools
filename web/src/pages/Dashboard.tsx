import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Box, Activity } from 'lucide-react';
import { ClassDiagram } from '../components/graphics/SystemGraphics';
import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';

function DashboardHeroGraphic() {
    return (
        <svg viewBox="0 0 600 400" className="w-full h-full drop-shadow-xl" fill="none">
            {/* Grid background */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
            </pattern>
            <rect width="600" height="400" fill="url(#grid)" />

            {/* Connectors */}
            <path d="M150 120 V 160" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[pulse_2s_infinite]" />
            <path d="M150 200 V 260" stroke="#6366f1" strokeWidth="1.5" />
            <path d="M150 260 H 300 V 300" stroke="#6366f1" strokeWidth="1.5" />
            <path d="M150 260 H 450 V 300" stroke="#6366f1" strokeWidth="1.5" />

            {/* Connection dots */}
            <circle cx="150" cy="160" r="3" fill="#6366f1" />
            <circle cx="300" cy="260" r="3" fill="#6366f1" />
            <circle cx="450" cy="260" r="3" fill="#6366f1" />

            {/* Nodes */}
            <g transform="translate(70, 80)">
                <rect width="160" height="40" rx="4" fill="#111722" stroke="rgba(255,255,255,0.15)" />
                <text x="80" y="24" fill="#F5F7FA" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Controller</text>
            </g>

            <g transform="translate(70, 160)">
                <rect width="160" height="40" rx="4" fill="#151C28" stroke="#6366f1" strokeWidth="1.5" className="hover:-translate-y-1 transition-transform cursor-pointer" />
                <text x="80" y="24" fill="#818cf8" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Service Layer</text>
            </g>

            <g transform="translate(20, 300)">
                <rect width="140" height="40" rx="4" fill="#111722" stroke="rgba(255,255,255,0.15)" />
                <text x="70" y="24" fill="#F5F7FA" fontSize="10" fontFamily="monospace" textAnchor="middle">Repository</text>
            </g>

            <g transform="translate(190, 300)">
                <rect width="160" height="60" rx="4" fill="#111722" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" />
                <text x="80" y="24" fill="#8A94A6" fontSize="10" fontFamily="monospace" textAnchor="middle">«interface»</text>
                <text x="80" y="40" fill="#F5F7FA" fontSize="10" fontFamily="monospace" textAnchor="middle">Strategy</text>
            </g>

            <g transform="translate(380, 300)">
                <rect width="140" height="40" rx="4" fill="#111722" stroke="rgba(255,255,255,0.15)" />
                <text x="70" y="24" fill="#F5F7FA" fontSize="10" fontFamily="monospace" textAnchor="middle">Factory</text>
            </g>

            {/* Visual Glass pane over factory */}
            <rect x="370" y="290" width="160" height="60" rx="6" fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />

            {/* Code mini block */}
            <g transform="translate(350, 100)">
                <rect width="180" height="120" rx="6" fill="#080B12" stroke="rgba(255,255,255,0.05)" />
                <circle cx="15" cy="15" r="3" fill="#ef4444" />
                <circle cx="25" cy="15" r="3" fill="#eab308" />
                <circle cx="35" cy="15" r="3" fill="#22c55e" />
                <line x1="15" y1="35" x2="165" y2="35" stroke="rgba(255,255,255,0.05)" />

                <text x="15" y="55" fill="#06b6d4" fontSize="9" fontFamily="monospace">interface</text>
                <text x="70" y="55" fill="#F5F7FA" fontSize="9" fontFamily="monospace">Observer {'{'}</text>
                <text x="25" y="75" fill="#6366f1" fontSize="9" fontFamily="monospace">void</text>
                <text x="50" y="75" fill="#8A94A6" fontSize="9" fontFamily="monospace">update(State s);</text>
                <text x="15" y="95" fill="#F5F7FA" fontSize="9" fontFamily="monospace">{'}'}</text>
            </g>
        </svg>
    )
}

export default function Dashboard() {
    const { data: attempts, isLoading: loadingAtt, error: errAtt, refetch: refAtt } = useApi<any[]>('/attempts');
    const { data: problems, isLoading: loadingProb, error: errProb, refetch: refProb } = useApi<any[]>('/problems');

    const handleRetry = () => { refAtt(); refProb(); };

    if (loadingAtt || loadingProb) return <LoadingSkeleton />;
    if (errAtt || errProb) return <ApiErrorState error={errAtt || errProb || ''} onRetry={handleRetry} />;

    // Aggregation metrics calculation
    const totalAttempts = attempts?.length || 0;
    const completed = attempts?.filter(a => a.status === 'COMPLETED').length || 0;
    const averageScore = totalAttempts > 0
        ? Math.round(attempts!.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / totalAttempts)
        : 0;
    const streak = totalAttempts > 0 ? 3 : 0; // Mock streak for MVP metrics
    const activeAttempt = attempts?.find(a => a.status === 'DRAFT');
    const recentReview = attempts?.find(a => a.status === 'COMPLETED' && a.score);

    const problemList = problems?.slice(0, 3) || [];

    return (
        <div className="flex flex-col w-full pb-16 space-y-16 max-w-6xl">
            {/* LLD STUDIO HERO */}
            <div className="flex flex-col lg:flex-row gap-12 items-center min-h-[400px]">
                <div className="flex-1 space-y-6 z-10 w-full">
                    <p className="text-[11px] font-mono font-bold tracking-[0.2em] text-muted uppercase">Good Morning, Designer.</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                        Build systems.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan">Design better objects.</span>
                    </h1>
                    <p className="text-sm text-muted leading-relaxed max-w-md font-medium">
                        Practice real-world Low-Level Design problems and learn how responsibilities, abstractions, relationships, and patterns shape maintainable software.
                    </p>
                    <div className="flex items-center space-x-4 pt-4 mb-8">
                        <Link to="/problems" className="bg-foreground text-background px-6 py-2.5 text-sm font-bold rounded hover:bg-white transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            Start Practicing
                        </Link>
                        <Link to="/attempts" className="px-6 py-2.5 text-sm font-bold text-muted hover:text-foreground border border-border rounded transition-colors">
                            View My Attempts
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4">
                        <div className="bg-elevated border border-border rounded p-4 flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted tracking-wide mb-1">Total Attempts</span>
                            <span className="text-2xl font-bold text-foreground">{totalAttempts}</span>
                        </div>
                        <div className="bg-elevated border border-border rounded p-4 flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted tracking-wide mb-1">Completed</span>
                            <span className="text-2xl font-bold text-foreground">{completed}</span>
                        </div>
                        <div className="bg-elevated border border-border rounded p-4 flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted tracking-wide mb-1">Average Score</span>
                            <span className="text-2xl font-bold text-foreground">{averageScore}%</span>
                        </div>
                        <div className="bg-elevated border border-border rounded p-4 flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-cyan tracking-wide mb-1">Current Streak</span>
                            <span className="text-2xl font-bold text-cyan">{streak}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full h-[400px] relative pointer-events-none hidden md:block">
                    <DashboardHeroGraphic />
                </div>
            </div>

            {/* WHAT DO YOU WANT TO DESIGN? */}
            <div className="w-full">
                <h3 className="text-xl font-bold text-foreground mb-6">Recommended Problems</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problemList.map(problem => (
                        <div key={problem.id} className="bg-card border border-border rounded-xl p-6 group hover:-translate-y-1 hover:border-accent/40 shadow-sm transition-all duration-300 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            {/* Graphic Space */}
                            <div className="h-32 mb-6 flex justify-center items-center">
                                <ClassDiagram
                                    title={problem.title.replace(/\s+/g, '')}
                                    attributes={['id: String', 'state: State']}
                                    methods={['process()', 'reset()']}
                                    width={140}
                                />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-foreground group-hover:text-cyan transition-colors">{problem.title}</h4>
                                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">{problem.difficulty}</span>
                            </div>

                            <p className="text-[13px] text-muted mb-6 leading-relaxed flex-1 line-clamp-3">
                                {problem.description}
                            </p>

                            <Link to={`/practice/new?problemId=${problem.id}`} className="mt-auto w-full py-2.5 rounded border border-border text-center text-sm font-bold text-foreground hover:bg-white/5 transition-colors flex justify-center items-center group-hover:border-white/20">
                                Start Design <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                    {(!problems || problems.length === 0) && (
                        <div className="col-span-full py-10 text-center border border-dashed border-border rounded-xl">
                            <p className="text-muted text-sm pb-4">No problems seeded in the database.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* LAYOUT SPLIT: ACTIVE DESIGNS & RECENT REVIEWS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Design Section */}
                <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase mb-4">Active Design</h3>
                    {activeAttempt ? (
                        <div className="bg-elevated border border-border rounded-xl p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-lg font-bold text-foreground">{activeAttempt.problem?.title}</h4>
                                    <p className="text-xs text-muted mb-4">Attempt #{activeAttempt.id.split('-')[0]} • Last edited 12 mins ago</p>
                                </div>
                                <Activity className="text-cyan animate-pulse" size={20} />
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-[10px] text-muted font-bold font-mono uppercase mb-2"><span>Progress Overview</span><span>80%</span></div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan w-[80%] rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex space-x-2 mb-6">
                                <span className="bg-background border border-border text-muted text-[10px] px-2 py-1 rounded">SRP</span>
                                <span className="bg-background border border-border text-muted text-[10px] px-2 py-1 rounded">Composition</span>
                                <span className="bg-background border border-border text-muted text-[10px] px-2 py-1 rounded">Strategy</span>
                            </div>
                            <Link to={`/practice/${activeAttempt.id}`} className="mt-auto flex items-center justify-center w-full py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-bold rounded transition-colors shadow">
                                Continue Designing →
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-card border border-border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center h-[260px]">
                            <Box size={32} className="text-muted/50 mb-4" />
                            <h4 className="text-sm font-bold text-foreground mb-1">Your design can start here</h4>
                            <p className="text-xs text-muted mb-6">Choose a problem and build your first architecture.</p>
                            <Link to="/problems" className="py-2 px-4 rounded border border-border text-xs font-bold text-foreground hover:bg-white/5 transition-colors">
                                Start Your First Design
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Reviews Section */}
                <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase mb-4">Recent Design Reviews</h3>
                    {recentReview ? (
                        <div className="bg-[#0B0E14] border border-border rounded-xl p-6 font-mono text-sm relative overflow-hidden group hover:border-accent/30 transition-colors cursor-default">
                            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
                                <div>
                                    <h4 className="text-foreground font-bold text-base mb-1">{recentReview.problem?.title} <span className="text-accent">Review</span></h4>
                                    <span className="text-muted text-[10px] uppercase">Automated Evaluator</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-foreground">{recentReview.score}</span>
                                    <span className="text-xs text-muted">/100</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {['Responsibility', 'Abstraction', 'Extensibility'].map((metric, i) => {
                                    const mVal = Math.max(30, recentReview.score - (i * 4));
                                    return (
                                        <div key={metric} className="flex justify-between items-center">
                                            <span className="text-muted text-[11px] uppercase w-1/2">{metric}</span>
                                            <div className="flex-1 flex items-center space-x-3">
                                                <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                                                    <div className="h-full bg-accent/80 rounded-full" style={{ width: `${mVal}%` }}></div>
                                                </div>
                                                <span className="text-foreground text-xs font-bold w-6">{mVal}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <Link to={`/feedback/${recentReview.id}`} className="mt-8 flex justify-center py-2 bg-elevated border border-border hover:bg-white/5 text-xs text-foreground font-bold transition-colors font-sans rounded">
                                View Full Review
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-card border border-border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center h-[260px]">
                            <ShieldCheck size={32} className="text-muted/50 mb-4" />
                            <h4 className="text-sm font-bold text-foreground mb-1">No reviews yet</h4>
                            <p className="text-xs text-muted mb-6">Complete a design architecting session to get feedback.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* DESIGN TOOLKIT */}
            <div className="w-full">
                <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase mb-4">Design Toolkit</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { num: '01', title: 'SOLID' },
                        { num: '02', title: 'COMPOSITION' },
                        { num: '03', title: 'INTERFACES' },
                        { num: '04', title: 'PATTERNS' },
                        { num: '05', title: 'RESPONSIBILITIES' }
                    ].map(tk => (
                        <div key={tk.num} className="bg-elevated border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center group hover:border-accent/30 transition-all hover:-translate-y-1">
                            <span className="text-[10px] font-mono text-cyan mb-3">{tk.num}</span>
                            <span className="text-xs font-bold text-foreground">{tk.title}</span>
                            <div className="w-8 h-px bg-border group-hover:bg-accent transition-colors mt-4"></div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
