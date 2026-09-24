import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';

export default function Profile() {
    const { data: attempts, isLoading, error, refetch } = useApi<any[]>('/attempts');

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;

    const totalAttempts = attempts?.length || 0;
    const completed = attempts?.filter(a => a.status === 'COMPLETED').length || 0;
    const averageScore = totalAttempts > 0
        ? Math.round(attempts!.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / totalAttempts)
        : 0;

    return (
        <div className="w-full max-w-2xl mx-auto pt-10 animate-fade-in">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <div className="h-24 bg-gradient-to-r from-accent/20 to-cyan/10 border-b border-border"></div>
                <div className="px-8 pb-8 relative">
                    <div className="absolute -top-12 w-24 h-24 bg-elevated border-4 border-card rounded-xl shadow flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/identicon/svg?seed=DF" alt="Avatar" className="w-full h-full opacity-90" />
                    </div>

                    <div className="mt-14 space-y-1">
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Demo Learner</h1>
                        <p className="text-xs font-mono uppercase text-muted tracking-widest">LLD Practice Profile</p>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="bg-background border border-border rounded p-4 text-center">
                            <div className="text-[10px] uppercase font-mono tracking-widest text-muted mb-1 font-bold">Designs</div>
                            <div className="text-2xl font-bold font-mono text-foreground">{isLoading ? '-' : totalAttempts}</div>
                        </div>
                        <div className="bg-background border border-border rounded p-4 text-center">
                            <div className="text-[10px] uppercase font-mono tracking-widest text-muted mb-1 font-bold">Completed</div>
                            <div className="text-2xl font-bold font-mono text-foreground">{isLoading ? '-' : completed}</div>
                        </div>
                        <div className="bg-accent/5 border border-accent/20 rounded p-4 text-center">
                            <div className="text-[10px] uppercase font-mono tracking-widest text-accent mb-1 font-bold">Average Score</div>
                            <div className="text-2xl font-bold font-mono text-accent">{isLoading ? '-' : averageScore}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xs font-mono font-bold tracking-widest text-muted uppercase mb-4 pl-1">Recent Design Activity</h3>
                <div className="bg-card border border-border rounded-xl p-8 flex justify-center items-center h-32 text-muted text-xs font-mono">
                    {isLoading ? <LoadingSkeleton lines={1} /> : attempts && attempts.length > 0 ? (
                        <div className="w-full text-foreground flex justify-between px-4">
                            <span>Started: {attempts[0]?.problem?.title}</span>
                            <span className="text-accent">{attempts[0]?.status}</span>
                        </div>
                    ) : (
                        'No design telemetry available yet.'
                    )}
                </div>
            </div>
        </div>
    );
}
