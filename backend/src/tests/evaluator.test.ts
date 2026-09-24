import { describe, it, expect } from 'vitest';
import { TextSubmissionParser } from '../domain/evaluation/SubmissionParser';
import { DeterministicEvaluationEngine } from '../domain/evaluation/DeterministicEvaluationEngine';

describe('Deterministic Evaluator', () => {
    it('should correctly parse structural classes and patterns', () => {
        const parser = new TextSubmissionParser();
        const content = "class Foo {}\nclass Bar {}\nWe use the Strategy pattern here.";
        const result = parser.parse(content);

        expect(result.classes.map(c => c.name)).toEqual(['Foo', 'Bar']);
        expect(result.mentionedPatterns).toContain('strategy');
    });

    it('should evaluate and penalize missing requirements', async () => {
        const engine = new DeterministicEvaluationEngine();
        const problem: any = { concepts: 'User, Auth, Session' };

        const result = await engine.evaluate(problem, {
            classes: [{ name: 'User', methods: [] }],
            mentionedPatterns: [],
            rawText: ''
        });

        const reqCov = result.categories.find(c => c.category === 'Requirement Coverage');
        expect(reqCov).toBeDefined();
        // Missing Auth and Session so score should be low
        expect(reqCov!.score).toBeLessThan(40);
    });
});
