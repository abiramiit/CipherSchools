import { prisma } from '../prisma';
import { DeterministicEvaluationEngine } from '../domain/evaluation/DeterministicEvaluationEngine';
import { TextSubmissionParser } from '../domain/evaluation/SubmissionParser';

export class EvaluationService {
    async processEvaluation(attemptId: string) {
        const attempt = await prisma.attempt.findUnique({
            where: { id: attemptId },
            include: { problem: true, submission: true }
        });

        if (!attempt || !attempt.submission) throw new Error('Invalid attempt or missing submission');

        try {
            const parser = new TextSubmissionParser();
            const parsed = parser.parse(attempt.submission.content);

            const evaluator = new DeterministicEvaluationEngine();
            const result = await evaluator.evaluate(attempt.problem, parsed);

            await prisma.evaluation.create({
                data: {
                    attemptId: attempt.id,
                    overallScore: result.overallScore,
                    feedbackDetails: JSON.stringify(result.categories),
                    evaluatedWithAI: false
                }
            });

            await prisma.attempt.update({
                where: { id: attemptId },
                data: { status: 'COMPLETED', score: result.overallScore }
            });

        } catch (err) {
            console.error('Evaluation error:', err);
            await prisma.attempt.update({
                where: { id: attemptId },
                data: { status: 'FAILED' }
            });
        }
    }
}
