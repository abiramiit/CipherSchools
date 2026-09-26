import { prisma } from '../prisma';
import { EvaluationService } from './evaluation.service';

export class AttemptService {
    async createAttempt(problemId: string, userId: string) {
        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma.user.create({ data: { id: userId, username: `dev-user-${userId}` } });
        }

        return prisma.attempt.create({
            data: {
                problemId,
                userId,
                status: 'DRAFT',
            },
            include: { problem: true }
        });
    }

    async getAttempt(id: string) {
        return prisma.attempt.findUnique({
            where: { id },
            include: { problem: true, submission: true, evaluation: true }
        });
    }

    async getAllAttempts(userId: string) {
        return prisma.attempt.findMany({
            where: { userId },
            include: { problem: true },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async updateDraft(attemptId: string, content: string) {
        console.log('[updateDraft service] attemptId:', attemptId);
        console.log('[updateDraft service] content length:', content?.length);
        const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } });
        if (!attempt) throw new Error('Attempt not found');

        const savedSubmission = await prisma.submission.upsert({
            where: { attemptId },
            update: { content },
            create: { attemptId, content }
        });
        console.log('[updateDraft service] saved submission:', savedSubmission);
        return this.getAttempt(attemptId);
    }

    async submitAttempt(attemptId: string, content?: string) {
        let finalContent = content;

        const attemptRecord = await prisma.attempt.findUnique({
            where: { id: attemptId },
            include: { submission: true }
        });

        console.log('[submit service] attemptId:', attemptId);
        console.log('[submit service] submission:', attemptRecord?.submission);
        console.log('[submit service] fetched content length:', attemptRecord?.submission?.content?.length);
        console.log('[submit service] arg content length:', content?.length);

        if (!attemptRecord) throw new Error('Attempt not found');

        if (content === undefined && attemptRecord.submission?.content) {
            finalContent = attemptRecord.submission.content;
        }

        if (finalContent === undefined || finalContent.trim().length === 0) {
            console.log('[submit service] Error: Submission cannot be empty');
            throw new Error('Submission cannot be empty');
        }

        if (attemptRecord.status !== 'DRAFT' && attemptRecord.status !== 'FAILED') {
            throw new Error('Attempt is already submitted or evaluating');
        }

        if (content !== undefined) {
            await this.updateDraft(attemptId, content);
        }

        const attempt = await prisma.attempt.update({
            where: { id: attemptId },
            data: { status: 'EVALUATING' }
        });

        // Asynchronous evaluation
        const evalService = new EvaluationService();
        evalService.processEvaluation(attemptId).catch(console.error);

        return attempt;
    }

    async getEvaluation(attemptId: string) {
        const evalData = await prisma.evaluation.findUnique({ where: { attemptId } });
        if (!evalData) throw new Error('Evaluation not found');
        return evalData;
    }

    async retryAttempt(oldAttemptId: string) {
        const old = await prisma.attempt.findUnique({ where: { id: oldAttemptId } });
        if (!old) throw new Error('Attempt not found');

        return this.createAttempt(old.problemId, old.userId);
    }
}
