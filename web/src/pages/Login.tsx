import { useNavigate } from 'react-router-dom';
import { Box } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();

    const handleDemoLogin = () => {
        localStorage.setItem('df_user', JSON.stringify({ name: 'Abirami S', role: 'LLD Learner' }));
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-card border border-border shadow-xl rounded-2xl flex flex-col items-center justify-center mb-6 relative hover:scale-105 transition-transform duration-500 group">
                        <div className="absolute inset-0 bg-accent/20 blur-xl group-hover:bg-accent/30 transition-all rounded-full -z-10"></div>
                        <Box size={28} className="text-foreground" />
                        <span className="font-mono text-[10px] font-bold tracking-widest mt-1 text-accent">DF</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">DesignForge</h2>
                    <p className="mt-2 text-sm text-secondary font-mono tracking-wide">LLD Practice Platform</p>
                    <p className="mt-6 text-sm text-muted italic">"Think in objects. Design with intent."</p>
                </div>

                <div className="bg-card border border-border p-8 rounded-2xl shadow-lg mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Email address</label>
                            <input type="email" placeholder="you@engineering.com" className="w-full bg-background border border-border rounded p-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Password</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded p-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
                        </div>
                        <button onClick={handleDemoLogin} className="w-full bg-accent/10 border-2 border-accent text-accent font-bold py-3 rounded hover:bg-accent hover:text-white transition-all shadow-sm">
                            Sign In
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                        <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted uppercase font-bold tracking-wider">Or</span></div>
                    </div>

                    <button onClick={handleDemoLogin} className="w-full bg-elevated border border-border text-foreground font-bold py-3 rounded hover:bg-white/5 transition-colors">
                        Continue as Demo Learner
                    </button>

                    <p className="text-center text-[10px] uppercase tracking-widest text-muted mt-4">Practice • Design • Review • Improve</p>
                </div>
            </div>
        </div>
    );
}
