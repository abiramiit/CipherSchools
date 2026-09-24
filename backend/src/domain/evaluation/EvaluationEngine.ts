import { Problem } from '@prisma/client';
import { ParsedSubmission } from './SubmissionParser';

export interface EvaluationCategoryScore {
    category: string;
    score: number;
    observation: string;
    whyItMatters: string;
    suggestion: string;
}

export interface EvaluationResult {
    overallScore: number;
    categories: EvaluationCategoryScore[];
}

export interface EvaluationEngine {
    evaluate(problem: Problem, submission: ParsedSubmission): Promise<EvaluationResult>;
}
