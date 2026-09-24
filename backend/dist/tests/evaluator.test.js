"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const SubmissionParser_1 = require("../domain/evaluation/SubmissionParser");
const DeterministicEvaluationEngine_1 = require("../domain/evaluation/DeterministicEvaluationEngine");
(0, vitest_1.describe)('Deterministic Evaluator', () => {
    (0, vitest_1.it)('should correctly parse structural classes and patterns', () => {
        const parser = new SubmissionParser_1.TextSubmissionParser();
        const content = "class Foo {}\nclass Bar {}\nWe use the Strategy pattern here.";
        const result = parser.parse(content);
        (0, vitest_1.expect)(result.classes.map(c => c.name)).toEqual(['Foo', 'Bar']);
        (0, vitest_1.expect)(result.mentionedPatterns).toContain('strategy');
    });
    (0, vitest_1.it)('should evaluate and penalize missing requirements', async () => {
        const engine = new DeterministicEvaluationEngine_1.DeterministicEvaluationEngine();
        const problem = { concepts: 'User, Auth, Session' };
        const result = await engine.evaluate(problem, {
            classes: [{ name: 'User', methods: [] }],
            mentionedPatterns: [],
            rawText: ''
        });
        const reqCov = result.categories.find(c => c.category === 'Requirement Coverage');
        (0, vitest_1.expect)(reqCov).toBeDefined();
        // Missing Auth and Session so score should be low
        (0, vitest_1.expect)(reqCov.score).toBeLessThan(40);
    });
});
