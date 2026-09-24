export default function ArchitectureGraph() {
    return (
        <svg className="w-full h-full max-w-lg mx-auto drop-shadow-[0_0_15px_rgba(0,230,118,0.15)]" viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E676" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#151A24" />
                    <stop offset="100%" stopColor="#0B0E14" />
                </linearGradient>
            </defs>

            <path d="M200 60 V 100" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_3s_linear_infinite]" />
            <path d="M200 140 V 180" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M100 180 H 300" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M100 180 V 220" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M200 180 V 220" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M300 180 V 220" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M100 260 V 280 H 200 V 300" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_3s_linear_infinite]" />
            <path d="M200 260 V 300" stroke="url(#lineGrad)" strokeWidth="2" />
            <path d="M300 260 V 280 H 200" stroke="url(#lineGrad)" strokeWidth="2" />

            <g transform="translate(140, 20)" className="hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <rect width="120" height="40" rx="6" fill="#151A24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x="60" y="24" fill="#F5F7FA" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Controller</text>
            </g>

            <g transform="translate(140, 100)">
                <rect width="120" height="40" rx="6" fill="#10141C" stroke="#00E676" strokeWidth="1.5" filter="url(#glow)" />
                <text x="60" y="24" fill="#69F0AE" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Service</text>
            </g>

            <g transform="translate(40, 220)" className="hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <rect width="120" height="40" rx="6" fill="#151A24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x="60" y="24" fill="#F5F7FA" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Repository</text>
            </g>

            <g transform="translate(170, 220)" className="hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <rect width="60" height="40" rx="6" fill="#151A24" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x="30" y="24" fill="#8B93A7" fontSize="10" textAnchor="middle" fontFamily="system-ui">Strategy</text>
            </g>

            <g transform="translate(240, 220)" className="hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <rect width="120" height="40" rx="6" fill="#151A24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <text x="60" y="24" fill="#F5F7FA" fontSize="12" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Factory</text>
            </g>

            <g transform="translate(140, 300)" className="hover:-translate-y-1 transition-transform duration-300 cursor-default">
                <rect width="120" height="40" rx="6" fill="url(#dbGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <path d="M 120 10 Q 60 20 0 10 V 30 Q 60 40 120 30 Z" fill="#0B0E14" />
                <ellipse cx="60" cy="10" rx="60" ry="10" fill="#151A24" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <path d="M 0 10 V 30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <path d="M 120 10 V 30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <path d="M 0 30 A 60 10 0 0 0 120 30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                <text x="60" y="29" fill="#F5F7FA" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="system-ui">Database</text>
            </g>

            <style>{`
            @keyframes dash {
                to { stroke-dashoffset: -12; }
            }
        `}</style>
        </svg>
    );
}
