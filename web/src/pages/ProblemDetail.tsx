import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';
import { fetchApi } from '../lib/api';
import { useState } from 'react';

export default function ProblemDetail() {
    const { id } = useParams();
    const { data: problem, isLoading, error, refetch } = useApi<any>(`/problems/${id}`);
    const [starting, setStarting] = useState(false);
    const navigate = useNavigate();

    const handleStartPractice = async () => {
        setStarting(true);
        const { data, error } = await fetchApi('/attempts', {
            method: 'POST',
            body: JSON.stringify({ problemId: id, userId: 'demo-learner' })
        });
        if (!error && data?.id) {
            navigate(`/practice/${data.id}`);
        } else {
            console.error('Failed to start attempt', error);
            setStarting(false);
        }
    };

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;
    if (isLoading || !problem) return <div className="p-8 max-w-4xl"><LoadingSkeleton lines={5} /></div>;

    return (
        <div className="w-full pb-16 space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{problem.title}</h1>
                        <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 border rounded ${problem.difficulty === 'HARD' ? 'bg-error/10 text-error border-error/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                            {problem.difficulty}
                        </span>
                    </div>
                    <button
                        onClick={handleStartPractice}
                        disabled={starting}
                        className="bg-accent text-white font-bold py-3 px-8 rounded hover:brightness-110 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                    >
                        {starting ? 'Initializing...' : 'Start Practice'}
                    </button>
                </div>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Description</h3>
                        <p className="text-foreground text-sm leading-relaxed">{problem.description}</p>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Functional Requirements</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                            {problem.requirements?.map((req: string, i: number) => (
                                <li key={i}>{req}</li>
                            )) || <li>Model the main components inside the system.</li>}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Suggested Concepts</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Composition', 'Factory', 'Observer', 'SOLID'].map((c, i) => (
                                <span key={i} className="bg-elevated border border-border text-xs px-3 py-1.5 rounded font-mono text-muted">{c}</span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
