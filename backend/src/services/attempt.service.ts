import { prisma } from '../prisma';
import { EvaluationService } from './evaluation.service';

export class AttemptService {
    async createAttempt(problemId: string, userId: string) {
        let user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    username: `dev-user-${userId}`
                }
            });
        }

        return prisma.attempt.create({
            data: {
                problemId,
                userId,
                status: 'DRAFT',
            },
            include: {
                problem: true
            }
        });
    }

    async getAttempt(id: string) {
        return prisma.attempt.findUnique({
            where: { id },
            include: {
                problem: true,
                submission: true,
                evaluation: true
            }
        });
    }

    async getAllAttempts(userId: string) {
        return prisma.attempt.findMany({
            where: { userId },
            include: {
                problem: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
    }

    async updateDraft(attemptId: string, content: string) {
        console.log('[updateDraft service] attemptId:', attemptId);
        console.log(
            '[updateDraft service] content length:',
            content?.length
        );

        const attempt = await prisma.attempt.findUnique({
            where: { id: attemptId }
        });

        if (!attempt) {
            throw new Error('Attempt not found');
        }

        const savedSubmission = await prisma.submission.upsert({
            where: {
                attemptId
            },
            update: {
                content
            },
            create: {
                attemptId,
                content
            }
        });

        console.log(
            '[updateDraft service] saved submission:',
            savedSubmission
        );

        return this.getAttempt(attemptId);
    }

    async submitAttempt(attemptId: string, content?: string) {
        let finalContent = content;

        const attemptRecord = await prisma.attempt.findUnique({
            where: {
                id: attemptId
            },
            include: {
                submission: true
            }
        });

        console.log('[submit service] attemptId:', attemptId);
        console.log(
            '[submit service] submission:',
            attemptRecord?.submission
        );
        console.log(
            '[submit service] fetched content length:',
            attemptRecord?.submission?.content?.length
        );
        console.log(
            '[submit service] arg content length:',
            content?.length
        );

        if (!attemptRecord) {
            throw new Error('Attempt not found');
        }

        /*
         * If the frontend does not send content in the POST request,
         * use the content already persisted by PATCH /api/attempts/:id.
         */
        if (
            content === undefined &&
            attemptRecord.submission?.content
        ) {
            finalContent = attemptRecord.submission.content;
        }

        /*
         * Do not allow an empty submission to enter evaluation.
         */
        if (
            finalContent === undefined ||
            finalContent.trim().length === 0
        ) {
            console.log(
                '[submit service] Error: Submission cannot be empty'
            );

            throw new Error('Submission cannot be empty');
        }

        /*
         * Only DRAFT and FAILED attempts can be submitted again.
         */
        if (
            attemptRecord.status !== 'DRAFT' &&
            attemptRecord.status !== 'FAILED'
        ) {
            throw new Error(
                'Attempt is already submitted or evaluating'
            );
        }

        /*
         * If content was supplied directly in the submit request,
         * persist it before starting evaluation.
         */
        if (content !== undefined) {
            await this.updateDraft(
                attemptId,
                content
            );
        }

        /*
         * Move the attempt into EVALUATING state.
         */
        const attempt = await prisma.attempt.update({
            where: {
                id: attemptId
            },
            data: {
                status: 'EVALUATING'
            }
        });

        console.log(
            '[SUBMIT] starting background evaluation:',
            attemptId
        );

        const evalService = new EvaluationService();

        /*
         * Run evaluation asynchronously.
         *
         * IMPORTANT:
         * If evaluation fails, the old implementation only logged
         * the error. That left the attempt permanently stuck in
         * EVALUATING.
         *
         * Now we explicitly mark the attempt as FAILED.
         */
        evalService.processEvaluation(attemptId).catch(async (err) => {
            console.error(
                '========================================'
            );

            console.error(
                '[EVALUATION FAILED]'
            );

            console.error(
                '[EVALUATION] Attempt ID:',
                attemptId
            );

            console.error(
                '[EVALUATION] Error:',
                err
            );

            console.error(
                '[EVALUATION] Error message:',
                err?.message
            );

            console.error(
                '[EVALUATION] Stack:',
                err?.stack
            );

            console.error(
                '========================================'
            );

            /*
             * Make sure the database does not remain stuck
             * in EVALUATING when evaluation crashes.
             */
            try {
                await prisma.attempt.update({
                    where: {
                        id: attemptId
                    },
                    data: {
                        status: 'FAILED'
                    }
                });

                console.log(
                    '[EVALUATION] Attempt marked FAILED:',
                    attemptId
                );
            } catch (updateError) {
                console.error(
                    '[EVALUATION] Failed to mark attempt as FAILED:',
                    updateError
                );
            }
        });

        /*
         * Return the attempt immediately because evaluation
         * continues in the background.
         */
        return attempt;
    }

    async getEvaluation(attemptId: string) {
        const evalData = await prisma.evaluation.findUnique({
            where: {
                attemptId
            }
        });

        if (!evalData) {
            throw new Error('Evaluation not found');
        }

        return evalData;
    }

    async retryAttempt(oldAttemptId: string) {
        const old = await prisma.attempt.findUnique({
            where: {
                id: oldAttemptId
            }
        });

        if (!old) {
            throw new Error('Attempt not found');
        }

        return this.createAttempt(
            old.problemId,
            old.userId
        );
    }
}