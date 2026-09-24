import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';

const CONTENT = {
    'solid': {
        title: 'SOLID Principles',
        desc: 'The Foundation of Understandable Code',
        modules: [
            { id: 'S', title: 'Single Responsibility', excerpt: 'A class should have one reason to change.' },
            { id: 'O', title: 'Open/Closed', excerpt: 'Software entities should be open for extension but closed for modification.' },
            { id: 'L', title: 'Liskov Substitution', excerpt: 'Subtypes must be substitutable for their base types.' },
            { id: 'I', title: 'Interface Segregation', excerpt: 'Many client-specific interfaces are better than one general-purpose interface.' },
            { id: 'D', title: 'Dependency Inversion', excerpt: 'Depend upon abstractions, not concretions.' }
        ]
    },
    'design-patterns': {
        title: 'Design Patterns',
        desc: 'Reusable Solutions to Common Problems',
        modules: [
            { id: 'CREATIONAL', title: 'Factory & Singleton', excerpt: 'Abstracting the instantiation process of objects.' },
            { id: 'STRUCTURAL', title: 'Adapter & Decorator', excerpt: 'Composing classes or objects into larger structures.' },
            { id: 'BEHAVIORAL', title: 'Strategy & Observer', excerpt: 'Assignments of responsibilities between objects.' }
        ]
    },
    'oop': {
        title: 'OOP Concepts',
        desc: 'Object-Oriented Programming Fundamentals',
        modules: [
            { id: 'ENC', title: 'Encapsulation', excerpt: 'Bundling data and methods that operate on that data within one unit.' },
            { id: 'ABS', title: 'Abstraction', excerpt: 'Hiding complex implementation details and showing only the essential features.' },
            { id: 'POL', title: 'Polymorphism', excerpt: 'The ability of different objects to respond to the same method call in their own way.' }
        ]
    },
    'relationships': {
        title: 'Component Relationships',
        desc: 'How Objects Interact and Depend on Each Other',
        modules: [
            { id: 'COM', title: 'Composition vs Aggregation', excerpt: 'Understanding strong "owns-a" vs weak "has-a" lifecycles.' },
            { id: 'ASC', title: 'Association', excerpt: 'Objects that know about each other but have independent lifecycles.' }
        ]
    }
} as Record<string, any>;

export default function LearningPage() {
    const { topic } = useParams();
    const data = CONTENT[topic || 'solid'];

    if (!data) return <div className="p-12 text-center text-muted">Topic not found.</div>;

    return (
        <div className="w-full pb-16 space-y-8 animate-fade-in max-w-5xl">
            <Link to="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors mb-4 group">
                <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="space-y-4 border-b border-border pb-8">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{data.title}</h1>
                <p className="text-sm font-mono text-muted tracking-wide max-w-md">{data.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.modules.map((m: any) => (
                    <div key={m.id} className="bg-card border border-border p-6 rounded-xl hover:border-accent/30 hover:-translate-y-0.5 transition-all group flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-black text-foreground group-hover:text-accent transition-colors">{m.id}</span>
                            <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center group-hover:text-cyan transition-colors">
                                <Terminal size={14} />
                            </div>
                        </div>
                        <h3 className="font-bold text-foreground mb-2">{m.title}</h3>
                        <p className="text-sm text-secondary mb-6 flex-1">{m.excerpt}</p>
                        <Link to="/problems" className="mt-auto text-[10px] font-bold uppercase tracking-widest bg-elevated border border-border text-center py-2 rounded text-muted hover:bg-white/5 transition-colors shadow-sm w-full block">
                            Practice in Problem Library
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
