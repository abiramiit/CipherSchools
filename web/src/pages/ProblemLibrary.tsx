import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Box } from 'lucide-react';
import { ClassDiagram } from '../components/graphics/SystemGraphics';
import { useApi } from '../hooks/useApi';
import { ApiErrorState, LoadingSkeleton } from '../components/ui/FeedbackStates';
import { fetchApi } from '../lib/api';

export default function ProblemLibrary() {
    const { data: problems, isLoading, error, refetch } = useApi<any[]>('/problems');
    const navigate = useNavigate();
    const [startingProblemId, setStartingProblemId] = useState<string | null>(null);

    const handleStartPractice = async (problemId: string) => {
        setStartingProblemId(problemId);
        const { data, error } = await fetchApi('/attempts', {
            method: 'POST',
            body: JSON.stringify({ problemId, userId: 'demo-learner' })
        });

        console.log("START PRACTICE RESPONSE DATA:", data, "ERROR:", error);

        if (!error && data?.id) {
            navigate(`/practice/${data.id}`);
        } else {
            console.error('Failed to create attempt. Data:', data, 'Error:', error);
            setStartingProblemId(null);
        }
    };

    console.log('PROBLEM LIBRARY DATA:', problems);
    console.log('PROBLEM LIBRARY LOADING:', isLoading);
    console.log('PROBLEM LIBRARY ERROR:', error);
    console.log('NUMBER OF PROBLEMS:', problems?.length);

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;

    return (
        <div className="w-full pb-16 space-y-12 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">PROBLEM LIBRARY</h1>
                    <p className="text-sm font-mono text-muted tracking-wide max-w-md">
                        "Choose a system. Model its objects. Defend your design."
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group w-full md:w-96 flex items-center">
                    <Search size={16} className="absolute left-3 text-muted" />
                    <input type="text" placeholder="Search LLD problems..." className="w-full bg-input border border-border py-2 pl-10 pr-4 text-sm text-foreground rounded focus:outline-none focus:border-accent transition-colors shadow-sm" />
                </div>
                <div className="flex bg-card border border-border p-1 rounded space-x-1">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map((f, i) => (
                        <button key={f} className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${i === 0 ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground hover:bg-white/5'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <LoadingSkeleton lines={4} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {(problems || []).map(problem => (
                        <div key={problem.id} className="bg-card border border-border rounded-xl flex flex-col hover:border-accent/30 hover:-translate-y-0.5 transition-all group overflow-hidden shadow-sm">
                            <div className="h-40 bg-secondary border-b border-border relative overflow-hidden flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <svg className="absolute inset-0 w-full h-full opacity-10"><pattern id={`gridp-${problem.id}`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern><rect width="100%" height="100%" fill={`url(#gridp-${problem.id})`} /></svg>

                                <ClassDiagram
                                    title={problem.title.replace(/\s+/g, '')}
                                    attributes={['id: uuid', 'active: bool']}
                                    methods={['create()', 'update()']}
                                    width={160}
                                />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-bold text-foreground group-hover:text-cyan transition-colors">{problem.title}</h2>
                                    <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 border rounded ${problem.difficulty?.toLowerCase() === 'hard' ? 'bg-error/10 text-error border-error/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                                        {problem.difficulty}
                                    </span>
                                </div>

                                <p className="text-[13px] text-muted mb-6 flex-1">
                                    {problem.description}
                                </p>

                                <div className="flex space-x-4 mb-6">
                                    <div className="flex items-center text-muted font-mono text-[10px] uppercase bg-background px-2 py-1 rounded border border-border">
                                        <Clock size={12} className="mr-1.5" /> {problem.estimatedMinutes} MIN
                                    </div>
                                    <div className="flex items-center text-muted font-mono text-[10px] uppercase bg-background px-2 py-1 rounded border border-border">
                                        <Box size={12} className="mr-1.5" /> {problem.concepts}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleStartPractice(problem.id)}
                                    disabled={startingProblemId === problem.id}
                                    className="mt-auto block w-full bg-elevated border border-border text-center py-2.5 rounded text-[13px] font-bold text-foreground hover:bg-white/5 transition-colors shadow disabled:opacity-50"
                                >
                                    {startingProblemId === problem.id ? 'Starting Runtime...' : 'Start Practice \u2192'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
