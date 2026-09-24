import { useState, useEffect } from 'react';

export default function Settings() {
    const [theme, setTheme] = useState(true);
    const [monospace, setMonospace] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const conf = localStorage.getItem('df_settings');
        if (conf) {
            try {
                const prefs = JSON.parse(conf);
                setTheme(prefs.theme ?? true);
                setMonospace(prefs.monospace ?? true);
                setAutoSave(prefs.autoSave ?? true);
            } catch (e) { }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('df_settings', JSON.stringify({ theme, monospace, autoSave }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="w-full max-w-3xl mx-auto pt-6 pb-20 animate-fade-in space-y-10">
            <div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Settings</h1>
                <p className="text-xs font-mono uppercase text-muted tracking-widest mt-2">Environment Configuration</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">

                <div className="p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4 font-mono uppercase tracking-widest">Appearance</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-foreground">Engineering Canvas Theme</div>
                            <div className="text-xs text-muted">Use the high-contrast dark architectural canvas.</div>
                        </div>
                        <div onClick={() => setTheme(!theme)} className={`w-12 h-6 rounded-full border-2 border-background flex items-center p-0.5 cursor-pointer opacity-90 transition-colors ${theme ? 'bg-accent justify-end' : 'bg-muted justify-start'}`}>
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4 font-mono uppercase tracking-widest">Editor Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-foreground">Monospace Fonts</div>
                                <div className="text-xs text-muted">Enforce monospace for design concepts.</div>
                            </div>
                            <div onClick={() => setMonospace(!monospace)} className={`w-12 h-6 rounded-full border-2 border-background flex items-center p-0.5 cursor-pointer opacity-90 transition-colors ${monospace ? 'bg-accent justify-end' : 'bg-muted justify-start'}`}>
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-foreground">Auto-Save Designs</div>
                            </div>
                            <div onClick={() => setAutoSave(!autoSave)} className={`w-12 h-6 rounded-full border-2 border-background flex items-center p-0.5 cursor-pointer opacity-90 transition-colors ${autoSave ? 'bg-accent justify-end' : 'bg-muted justify-start'}`}>
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-end items-center space-x-4">
                {saved && <span className="text-xs font-mono text-cyan uppercase">Saved</span>}
                <button onClick={handleSave} className="bg-elevated border border-border hover:bg-white/5 text-foreground px-6 py-2 rounded text-xs font-bold transition-colors">
                    Save Configuration
                </button>
            </div>
        </div>
    );
}
