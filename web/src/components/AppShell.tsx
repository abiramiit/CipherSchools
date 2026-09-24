import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Library, PenTool, Activity, Settings, Search, Bell, Box, SplitSquareHorizontal, Code2 } from 'lucide-react';
import { ArchitectureBackground } from './graphics/SystemGraphics';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
            <ArchitectureBackground />

            {/* Top Navigation */}
            <header className="h-14 border-b border-border bg-topnav flex items-center justify-between px-4 z-40 sticky top-0 shrink-0 shadow-sm">
                <div className="flex items-center space-x-4 w-[244px] shrink-0">
                    <div className="w-8 h-8 bg-sidebar border border-border rounded flex items-center justify-center font-mono font-bold text-xs text-[#F5F7FF] shadow-sm">
                        DF
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-[#F5F7FF] leading-tight tracking-wide">DesignForge</span>
                        <span className="text-[10px] text-muted uppercase tracking-widest font-mono">LLD Studio</span>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl px-4">
                    <div className="relative group flex items-center">
                        <Search size={14} className="absolute left-3 text-[#7F899B]" />
                        <input
                            type="text"
                            placeholder="Search problems, concepts, attempts..."
                            className="w-full bg-input border border-[#272D39] rounded-md py-1.5 pl-9 pr-12 text-sm text-[#F5F7FF] placeholder:text-[#8E98AA] focus:outline-none focus:border-accent transition-colors"
                        />
                        <div className="absolute right-2 flex items-center select-none pointer-events-none">
                            <span className="text-[10px] font-mono bg-topnav border border-border text-[#7F899B] px-1.5 rounded">⌘K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                    <button className="text-[#7F899B] hover:text-[#F5F7FF] relative transition-colors">
                        <Activity size={18} />
                    </button>
                    <button className="text-[#7F899B] hover:text-[#F5F7FF] relative transition-colors">
                        <Bell size={18} />
                        <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-topnav"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center cursor-pointer hover:border-accent/40 transition-colors shadow">
                        <img src="https://api.dicebear.com/7.x/identicon/svg?seed=DF" alt="Avatar" className="w-6 h-6 rounded-full opacity-90" />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left engineering-style sidebar */}
                <aside className="w-[260px] border-r border-border bg-sidebar shrink-0 hidden md:flex flex-col overflow-y-auto custom-scrollbar z-30">
                    <div className="py-6 flex flex-col flex-1">
                        <h3 className="text-[10px] font-mono font-bold tracking-widest text-[#7F899B] uppercase mb-4 px-3 pt-6">Workspace</h3>
                        <nav className="space-y-1 mb-8">
                            {[
                                { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={16} /> },
                                { label: 'Problem Library', path: '/problems', icon: <Library size={16} /> },
                                { label: 'My Attempts', path: '/attempts', icon: <PenTool size={16} /> },
                                { label: 'Progress', path: '/progress', icon: <Activity size={16} /> },
                            ].map((item) => {
                                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== '/feedback');
                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all group relative ${isActive
                                            ? 'bg-accent-activebg text-[#FFFFFF] border-l-2 border-accent font-bold pl-2.5 shadow-sm'
                                            : 'text-[#9CA6B7] hover:text-[#FFFFFF] hover:bg-[#181D28] border-l-2 border-transparent'
                                            }`}
                                    >
                                        <span className={`${isActive ? "text-accent-hover" : "text-[#7F899B] group-hover:text-[#F5F7FF]"} transition-colors`}>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        <h3 className="text-[10px] font-mono font-bold tracking-widest text-[#7F899B] uppercase mb-4 px-3">Learn</h3>
                        <nav className="space-y-1">
                            {[
                                { label: 'SOLID Principles', path: '/learning/solid', icon: <Box size={14} /> },
                                { label: 'Design Patterns', path: '/learning/design-patterns', icon: <SplitSquareHorizontal size={14} /> },
                                { label: 'OOP Concepts', path: '/learning/oop', icon: <Code2 size={14} /> },
                                { label: 'Relationships', path: '/learning/relationships', icon: <Code2 size={14} /> },
                            ].map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <NavLink key={item.label} to={item.path} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-all ${isActive ? 'text-[#FFFFFF] bg-[#181D28]' : 'text-[#AAB3C2] hover:text-[#F5F7FF] hover:bg-[#181D28]'
                                        }`}>
                                        <span className={`${isActive ? 'text-accent' : 'text-[#7F899B]'}`}>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        <div className="mt-auto px-3 border-t border-border pt-6 pb-2">
                            {(() => {
                                const isActive = location.pathname === '/settings';
                                return (
                                    <NavLink to="/settings" className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all group relative ${isActive
                                        ? 'bg-accent-activebg text-[#FFFFFF] border-l-2 border-accent font-bold pl-2.5 shadow-sm'
                                        : 'text-[#9CA6B7] hover:text-[#FFFFFF] hover:bg-[#181D28] border-l-2 border-transparent'
                                        }`}>
                                        <span className={`${isActive ? "text-accent-hover" : "text-[#7F899B] group-hover:text-[#F5F7FF]"} transition-colors`}>
                                            <Settings size={16} className="transition-transform group-hover:rotate-45" />
                                        </span>
                                        <span>Settings</span>
                                    </NavLink>
                                );
                            })()}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-20">
                    <div className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto animate-fade-in relative z-20 bg-background/50">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
