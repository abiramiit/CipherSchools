"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptService = void 0;
const prisma_1 = require("../prisma");
const evaluation_service_1 = require("./evaluation.service");
class AttemptService {
    async createAttempt(problemId, userId) {
        let user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma_1.prisma.user.create({ data: { id: userId, username: 'dev-user' } });
        }
        return prisma_1.prisma.attempt.create({
            data: {
                problemId,
                userId,
                status: 'DRAFT',
            },
            include: { problem: true }
        });
    }
    async getAttempt(id) {
        return prisma_1.prisma.attempt.findUnique({
            where: { id },
            include: { problem: true, submission: true, evaluation: true }
        });
    }
    async getAllAttempts(userId) {
        return prisma_1.prisma.attempt.findMany({
            where: { userId },
            include: { problem: true },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async updateDraft(attemptId, content) {
        const attempt = await prisma_1.prisma.attempt.findUnique({ where: { id: attemptId } });
        if (!attempt)
            throw new Error('Attempt not found');
        await prisma_1.prisma.submission.upsert({
            where: { attemptId },
            update: { content },
            create: { attemptId, content }
        });
        return this.getAttempt(attemptId);
    }
    async submitAttempt(attemptId, content) {
        if (!content || content.trim().length === 0) {
            throw new Error('Submission cannot be empty');
        }
        const attemptRecord = await prisma_1.prisma.attempt.findUnique({ where: { id: attemptId } });
        if (!attemptRecord)
            throw new Error('Attempt not found');
        if (attemptRecord.status !== 'DRAFT' && attemptRecord.status !== 'FAILED') {
            throw new Error('Attempt is already submitted or evaluating');
        }
        await this.updateDraft(attemptId, content);
        const attempt = await prisma_1.prisma.attempt.update({
            where: { id: attemptId },
            data: { status: 'EVALUATING' }
        });
        // Asynchronous evaluation
        const evalService = new evaluation_service_1.EvaluationService();
        evalService.processEvaluation(attemptId).catch(console.error);
        return attempt;
    }
    async getEvaluation(attemptId) {
        const evalData = await prisma_1.prisma.evaluation.findUnique({ where: { attemptId } });
        if (!evalData)
            throw new Error('Evaluation not found');
        return evalData;
    }
    async retryAttempt(oldAttemptId) {
        const old = await prisma_1.prisma.attempt.findUnique({ where: { id: oldAttemptId } });
        if (!old)
            throw new Error('Attempt not found');
        return this.createAttempt(old.problemId, old.userId);
    }
}
exports.AttemptService = AttemptService;
