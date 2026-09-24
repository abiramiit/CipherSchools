import { Problem } from '@prisma/client';
import { EvaluationEngine, EvaluationResult, EvaluationCategoryScore } from './EvaluationEngine';
import { ParsedSubmission } from './SubmissionParser';

export class AIEvaluationEngine implements EvaluationEngine {
    private fallbackEngine: EvaluationEngine;

    constructor(fallback: EvaluationEngine) {
        this.fallbackEngine = fallback;
    }

    async evaluate(problem: Problem, submission: ParsedSubmission): Promise<EvaluationResult> {
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.log('No AI key found, falling back to Deterministic Evaluation');
            return this.fallbackEngine.evaluate(problem, submission);
        }

        try {
            // Ideally we call an LLM here, taking the problem requirements
            // and the submission rawText, returning a structured JSON result.
            // For MVP demonstration, if we had a key, we mock the call for safety unless fully integrated.

            // Mocking a successful AI evaluation response for demonstration purposes:
            return {
                overallScore: 88,
                categories: [
                    {
                        category: "Semantic Understanding",
                        score: 90,
                        observation: "AI detected accurate domain mapping.",
                        whyItMatters: "Human-like understanding catches nuances.",
                        suggestion: "Keep up the good work."
                    }
                ]
            };
        } catch (error) {
            console.error('AI Eval failed, falling back', error);
            return this.fallbackEngine.evaluate(problem, submission);
        }
    }
}
