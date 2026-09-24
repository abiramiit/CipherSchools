export function ArchitectureBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none -z-10 bg-background overflow-hidden">
            {/* Fine architectural grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

            {/* Occasional Class Diagram Hints using faint SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                {/* Top left diagram hint */}
                <g transform="translate(100, 100)">
                    <rect x="0" y="0" width="120" height="80" rx="2" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    <line x1="0" y1="20" x2="120" y2="20" stroke="white" strokeWidth="1" />
                    <line x1="60" y1="80" x2="60" y2="150" stroke="white" strokeWidth="1" />
                    <polygon points="60,150 55,140 65,140" fill="white" />
                </g>
                <g transform="translate(40, 250)">
                    <rect x="0" y="0" width="120" height="60" rx="2" stroke="white" strokeWidth="1" fill="none" />
                    <line x1="0" y1="20" x2="120" y2="20" stroke="white" strokeWidth="1" />
                </g>

                {/* Right side connection hints (USING FIXED SVG COORDINATES) */}
                <g transform="translate(800, 200)">
                    <circle cx="0" cy="0" r="4" fill="white" />
                    <line x1="0" y1="0" x2="-80" y2="50" stroke="white" strokeWidth="1" />
                    <line x1="-80" y1="50" x2="-150" y2="50" stroke="white" strokeWidth="1" />
                    <rect x="-270" y="20" width="120" height="60" rx="2" stroke="white" strokeWidth="1" fill="none" />
                </g>
                <g transform="translate(700, 600)">
                    <rect x="0" y="0" width="100" height="100" rx="2" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                </g>
            </svg>

            {/* Faint ambient glow */}
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none" />
        </div>
    );
}

export function ClassDiagram({ title, methods, attributes, width = 140 }: { title: string, methods: string[], attributes: string[], width?: number }) {
    const boxHeight = 24 + (attributes.length * 16) + (methods.length * 16) + 16;
    return (
        <svg width={width} height={boxHeight} viewBox={`0 0 ${width} ${boxHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <rect x="1" y="1" width={width - 2} height={boxHeight - 2} rx="4" fill="#151922" stroke="#262C38" strokeWidth="1" />
            <rect x="1" y="1" width={width - 2} height="26" rx="4" fill="#12151C" stroke="#262C38" strokeWidth="1" />
            <text x={width / 2} y="18" fill="#F5F7FF" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{title}</text>
            <line x1="1" y1="27" x2={width - 1} y2="27" stroke="#262C38" strokeWidth="1" />
            {attributes.map((attr, idx) => (
                <text key={idx} x="8" y={42 + idx * 15} fill="#B7BFCE" fontSize="9" fontFamily="monospace">- {attr}</text>
            ))}
            <line x1="1" y1={27 + attributes.length * 16 + 8} x2={width - 1} y2={27 + attributes.length * 16 + 8} stroke="#262C38" strokeWidth="1" />
            {methods.map((method, idx) => (
                <text key={idx} x="8" y={27 + attributes.length * 16 + 24 + idx * 15} fill="#8B5CF6" fontSize="9" fontFamily="monospace">+ {method}</text>
            ))}
        </svg>
    );
}

export function EmptyArchitecture({ message, cta, onAction }: { message?: string, cta?: string, onAction?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-14 text-center animate-fade-in w-full">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mb-8 hover:-translate-y-2 hover:scale-105 transition-all duration-500 drop-shadow-xl">
                <g stroke="#8B5CF6" strokeWidth="1.5">
                    <rect x="40" y="40" width="45" height="35" rx="3" fill="#1E2533" stroke="#64748B" />
                    <rect x="115" y="40" width="45" height="35" rx="3" fill="#1E2533" stroke="#64748B" />
                    <rect x="75" y="115" width="50" height="40" rx="3" fill="#1E2533" stroke="#8B5CF6" strokeWidth="2" className="animate-[pulse_3s_infinite]" />

                    <line x1="62.5" y1="75" x2="90" y2="115" strokeDasharray="4 4" stroke="#475569" strokeWidth="1.5" />
                    <line x1="137.5" y1="75" x2="110" y2="115" stroke="#475569" strokeWidth="1.5" />

                    <polygon points="90,115 85,105 95,105" fill="#475569" />
                    <polygon points="110,115 105,105 115,105" fill="#475569" />
                </g>
                <circle cx="100" cy="100" r="90" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 12" opacity="0.3" className="animate-spin-slow" />
                <circle cx="100" cy="100" r="75" stroke="#262C38" strokeWidth="1" opacity="0.6" />
            </svg>
            <h3 className="text-xl font-bold text-[#F5F7FF] mb-2">{message || "Your architecture journey starts here."}</h3>
            <p className="text-sm text-[#9CA6B7] mb-8 max-w-sm">Design software systems using strict OOP paradigms and automated senior engineer reviews.</p>
            {cta && onAction && (
                <button
                    onClick={onAction}
                    className="px-8 py-3 rounded-md text-[13px] font-bold flex items-center group transition-all duration-300"
                    style={{
                        background: '#151922',
                        border: '1px solid #343B4A',
                        color: '#F5F7FF',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8B5CF6';
                        e.currentTarget.style.borderColor = '#8B5CF6';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.18)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#151922';
                        e.currentTarget.style.borderColor = '#343B4A';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {cta.toUpperCase()} <span className="ml-3 group-hover:translate-x-1.5 transition-transform">→</span>
                </button>
            )}
        </div>
    );
}

export function ScoreRing({ score, size = 120 }: { score: number, size?: number }) {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#262C38" strokeWidth={strokeWidth} fill="transparent" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#8B5CF6" strokeWidth={strokeWidth} fill="transparent"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-mono font-bold text-[#F5F7FF]">{score}</span>
                <span className="text-[10px] text-[#7F899B] font-bold tracking-widest mt-0.5 uppercase">Score</span>
            </div>
        </div>
    );
}
