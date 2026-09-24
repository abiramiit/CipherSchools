import { Problem } from '@prisma/client';
import { EvaluationEngine, EvaluationResult, EvaluationCategoryScore } from './EvaluationEngine';
import { ParsedSubmission } from './SubmissionParser';

export class DeterministicEvaluationEngine implements EvaluationEngine {
    async evaluate(problem: Problem, submission: ParsedSubmission): Promise<EvaluationResult> {
        const categories: EvaluationCategoryScore[] = [];

        // 1. Requirement Coverage
        const expectedEntities = problem.concepts.split(',').map(e => e.trim().toLowerCase());
        const submittedClasses = submission.classes.map(c => c.name.toLowerCase());
        const missingEntities = expectedEntities.filter(e => !submittedClasses.find(sc => sc.includes(e)));

        const coverageScore = expectedEntities.length === 0 ? 100 : Math.max(0, 100 - (missingEntities.length * (100 / expectedEntities.length)));

        categories.push({
            category: 'Requirement Coverage',
            score: Math.round(coverageScore),
            observation: missingEntities.length > 0 ? `Missing entities: ${missingEntities.join(', ')}` : 'All expected core entities were explicitly identified in your design.',
            whyItMatters: 'Without core entities, the system cannot fulfill business requirements effectively or represent the domain accurately.',
            suggestion: missingEntities.length > 0 ? `Consider adding classes that represent: ${missingEntities[0]}` : 'Excellent domain mapping.'
        });

        // 2. Responsibility Distribution (SRP)
        let hasGodClass = false;
        let godClassName = "";
        let classMethods = "";

        for (const cls of submission.classes) {
            // A simplistic check: if a class has more than 4 methods handling different semantic tasks
            const distinctVerbs = new Set(cls.methods.map(m => m.replace(/([A-Z])/g, ' $1').split(' ')[0].toLowerCase()));
            if (distinctVerbs.size > 3 || cls.methods.length > 5) {
                hasGodClass = true;
                godClassName = cls.name;
                classMethods = cls.methods.join(', ');
                break;
            }
        }

        if (hasGodClass) {
            categories.push({
                category: 'Responsibility Distribution',
                score: 40,
                observation: `${godClassName} appears to act as a God Class, concentrating too many responsibilities (found methods: ${classMethods}).`,
                whyItMatters: 'Classes with too many responsibilities (violating SRP) become rigid, fragile, and hard to test or extend.',
                suggestion: `Decompose ${godClassName} by extracting specific behaviors (e.g. calculation, persistence, network) into their own classes or interfaces.`
            });
        } else {
            categories.push({
                category: 'Responsibility Distribution',
                score: 95,
                observation: submission.classes.length > 0 ? `Responsibilities appear appropriately distributed among ${submission.classes.length} classes.` : 'No active classes evaluated.',
                whyItMatters: 'Single Responsibility Principle ensures modules are cohesive and can change independently.',
                suggestion: 'Continue to keep classes small and focused on a single axis of change.'
            });
        }

        // 3. Extensibility (Pattern check)
        const hasPatterns = submission.mentionedPatterns.length > 0;
        categories.push({
            category: 'Extensibility',
            score: hasPatterns ? 95 : 55,
            observation: hasPatterns ? `Utilized abstract structures/patterns: ${submission.mentionedPatterns.join(', ')}` : 'No prominent design patterns (e.g., Strategy, State, or Factory) were detected in the submission.',
            whyItMatters: 'Patterns abstract algorithm logic and allow the system to grow without constantly modifying core structures (Open/Closed Principle).',
            suggestion: hasPatterns ? 'Great usage of abstractions to decouple behavior.' : 'Consider using interfaces such as a Strategy for pricing or State for machine states to decouple logic.'
        });

        const overallScore = Math.round(categories.reduce((acc, curr) => acc + curr.score, 0) / categories.length);

        return {
            overallScore,
            categories
        };
    }
}
