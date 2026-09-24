"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationService = void 0;
const prisma_1 = require("../prisma");
const DeterministicEvaluationEngine_1 = require("../domain/evaluation/DeterministicEvaluationEngine");
const SubmissionParser_1 = require("../domain/evaluation/SubmissionParser");
class EvaluationService {
    async processEvaluation(attemptId) {
        const attempt = await prisma_1.prisma.attempt.findUnique({
            where: { id: attemptId },
            include: { problem: true, submission: true }
        });
        if (!attempt || !attempt.submission)
            throw new Error('Invalid attempt or missing submission');
        try {
            const parser = new SubmissionParser_1.TextSubmissionParser();
            const parsed = parser.parse(attempt.submission.content);
            const evaluator = new DeterministicEvaluationEngine_1.DeterministicEvaluationEngine();
            const result = await evaluator.evaluate(attempt.problem, parsed);
            await prisma_1.prisma.evaluation.create({
                data: {
                    attemptId: attempt.id,
                    overallScore: result.overallScore,
                    feedbackDetails: JSON.stringify(result.categories),
                    evaluatedWithAI: false
                }
            });
            await prisma_1.prisma.attempt.update({
                where: { id: attemptId },
                data: { status: 'COMPLETED', score: result.overallScore }
            });
        }
        catch (err) {
            console.error('Evaluation error:', err);
            await prisma_1.prisma.attempt.update({
                where: { id: attemptId },
                data: { status: 'FAILED' }
            });
        }
    }
}
exports.EvaluationService = EvaluationService;
