import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FolderOutput, CheckSquare, ListTree, Code2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchApi } from '../lib/api';
import { ApiErrorState } from '../components/ui/FeedbackStates';

export default function Workspace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useApi<any>(id && id !== 'new' ? `/attempts/${id}` : '');

    const [code, setCode] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const attempt = data;

    console.log('[Workspace] id:', id);
    console.log('[Workspace] endpoint:', id && id !== 'new' ? `/attempts/${id}` : '');
    console.log('[Workspace] data:', data);
    console.log('[Workspace] attempt:', attempt);
    console.log('[Workspace] isLoading:', isLoading);
    console.log('[Workspace] error:', error);

    // Initialize code from the remote submission
    useEffect(() => {
        if (attempt && !initialized) {
            setCode(attempt.submission?.content || '');
            setInitialized(true);
        }
    }, [attempt, initialized]);

    const handleSave = async (codeToSave: string) => {
        if (!id || id === 'new') return { error: 'Invalid ID' };
        setIsSaving(true);
        try {
            const result = await fetchApi(`/attempts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ content: codeToSave })
            });
            return result;
        } finally {
            setIsSaving(false);
        }
    };

    // Debounced Autosave
    useEffect(() => {
        if (!initialized) return;
        const timer = setTimeout(() => {
            handleSave(code);
        }, 1000);
        return () => clearTimeout(timer);
    }, [code, initialized]);

    const handleSubmit = async () => {
        if (!id || id === 'new') return;
        try {
            console.log('[Workspace] code length:', code.length);
            const saveRes = await handleSave(code);
            console.log('[Workspace] PATCH response:', saveRes);
            if (saveRes?.error) {
                alert(`Save failed before submit: ${saveRes.error}`);
                return;
            }
            console.log('[Workspace] submitting attempt:', id);
            const res = await fetchApi(`/attempts/${id}/submit`, {
                method: 'POST',
                body: JSON.stringify({ content: code })
            });
            if (res.error) {
                alert(`Submit failed: ${res.error}`);
                return;
            }
            navigate(`/feedback/${id}`);
        } catch (err: any) {
            alert(`Unexpected error: ${err.message}`);
        }
    };

    if (error) return <ApiErrorState error={error} onRetry={refetch} />;

    if (isLoading || !attempt) return (
        <div className="h-[60vh] flex items-center justify-center font-mono text-muted text-sm border border-border border-dashed rounded-lg bg-card mt-10">
            <span className="animate-pulse">CONNECTING TO WORKSPACE INSTANCE...</span>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in w-full -mx-4 md:-mx-10 px-4 md:px-10 absolute inset-0 pt-6">
            {/* Top Workspace Header */}
            <div className="flex justify-between items-center mb-4 bg-secondary p-2 rounded-t-lg border-x border-t border-border shrink-0">
                <div className="flex items-center space-x-4 pl-2">
                    <button onClick={() => navigate('/attempts')} className="text-muted hover:text-foreground transition-colors font-mono font-bold text-xs">
                        ← {attempt.problem?.title || 'WORKSPACE'}
                    </button>
                    <span className="text-muted flex items-center text-[10px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan mr-2 animate-pulse"></span>
                        {isSaving ? 'SYNCING...' : 'AUTOSAVED'}
                    </span>
                </div>
                <div>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-accent text-white font-bold text-xs rounded hover:bg-accent-light transition-colors shadow">
                        Submit Design →
                    </button>
                </div>
            </div>

            {/* 3-Panel Layout */}
            <div className="flex-1 flex flex-col lg:flex-row border-b border-x border-border overflow-hidden rounded-b-lg">

                {/* Panel 1: Requirements */}
                <div className="lg:w-1/4 flex flex-col bg-card border-r border-border shrink-0 z-10">
                    <div className="p-3 border-b border-border bg-[#0B0E14] text-[10px] font-mono font-bold uppercase tracking-widest text-muted flex items-center">
                        <CheckSquare size={12} className="mr-2" /> Requirements
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Functional Scope</h4>
                            <div className="space-y-3">
                                {[
                                    'Multiple vehicle capacities',
                                    'Different allocation strategies',
                                    'Extensible pricing model',
                                    'Concurrency safe spot assignment'
                                ].map((req, i) => (
                                    <div key={i} className="flex space-x-2 text-sm text-foreground/90">
                                        <span className="text-accent opacity-80 pt-0.5">✓</span>
                                        <span className="leading-snug">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-px bg-border w-full"></div>
                        <div>
                            <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">Problem Canvas</h4>
                            <p className="text-xs text-muted leading-relaxed font-mono bg-background p-3 rounded border border-border">
                                {attempt.problem?.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel 2: Editor */}
                <div className="flex-1 flex flex-col lg:w-1/2 bg-[#050608] z-0">
                    <div className="p-3 border-b border-border bg-[#080B12] text-[10px] font-mono font-bold uppercase tracking-widest text-muted flex items-center justify-between">
                        <div className="flex items-center"><Code2 size={12} className="mr-2" /> DESIGN EDITOR</div>
                        {isSaving && <span className="animate-spin-slow text-accent"><FolderOutput size={12} /></span>}
                    </div>
                    <textarea
                        className="flex-1 w-full p-4 bg-transparent text-[#e5e5e5] font-mono text-[13px] md:text-sm leading-relaxed resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-accent/10 transition-shadow custom-scrollbar !font-consolas"
                        spellCheck="false"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                        }}
                        style={{ fontFamily: "var(--font-mono)" }}
                        placeholder={`// Define Classes, Interfaces, Enums...\n\nclass ${attempt.problem?.title?.replace(/\s+/g, '')} {\n\n}`}
                    />
                </div>

                {/* Panel 3: Insights */}
                <div className="hidden lg:flex lg:w-[280px] flex-col bg-card border-l border-border shrink-0 z-10">
                    <div className="p-3 border-b border-border bg-[#0B0E14] text-[10px] font-mono font-bold uppercase tracking-widest text-muted flex items-center">
                        <ListTree size={12} className="mr-2" /> DESIGN INSIGHTS
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
                        <div>
                            <h4 className="text-[10px] font-bold text-muted mb-3 uppercase tracking-widest">SOLID Principles</h4>
                            <div className="space-y-2">
                                {['Single Responsibility', 'Open-Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'].map((val, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs font-mono py-1 border-b border-border/50 group hover:border-accent/50 transition-colors">
                                        <span className="text-foreground/80 group-hover:text-accent transition-colors">{val[0]} {val.split(' ')[1]?.[0] || 'R'}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-accent transition-colors"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-muted mb-3 uppercase tracking-widest">Tracking Entities</h4>
                            <div className="space-y-3 font-mono text-xs">
                                <span className="block text-cyan">class ParkingLot</span>
                                <span className="block text-white pl-4 border-l border-border">├─ spots</span>
                                <span className="block text-accent-light pl-4 border-l border-border">├─ park()</span>
                                <span className="block text-accent-light pl-4 border-l border-border">└─ exit()</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
