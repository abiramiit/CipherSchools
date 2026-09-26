import { prisma } from '../prisma';
import { DeterministicEvaluationEngine } from '../domain/evaluation/DeterministicEvaluationEngine';
import { TextSubmissionParser } from '../domain/evaluation/SubmissionParser';

export class EvaluationService {
    async processEvaluation(attemptId: string) {
        console.log('=================================================');
        console.log('[EVAL] START processEvaluation');
        console.log('[EVAL] attemptId:', attemptId);
        console.log('=================================================');

        try {
            // ---------------------------------------------------------
            // 1. LOAD ATTEMPT
            // ---------------------------------------------------------
            console.log('[EVAL] Step 1: loading attempt from database');

            const attempt = await prisma.attempt.findUnique({
                where: { id: attemptId },
                include: {
                    problem: true,
                    submission: true
                }
            });

            console.log('[EVAL] Step 1 complete');

            if (!attempt) {
                throw new Error(`Attempt not found: ${attemptId}`);
            }

            console.log('[EVAL] Problem:', attempt.problem?.title);
            console.log('[EVAL] Submission exists:', !!attempt.submission);

            if (!attempt.submission) {
                throw new Error(`Submission missing for attempt: ${attemptId}`);
            }

            const content = attempt.submission.content;

            console.log('[EVAL] Content length:', content?.length);
            console.log('[EVAL] Content preview:', content?.substring(0, 200));

            if (!content || content.trim().length === 0) {
                throw new Error('Submission content is empty');
            }

            // ---------------------------------------------------------
            // 2. PARSE SUBMISSION
            // ---------------------------------------------------------
            console.log('[EVAL] Step 2: initializing parser');

            const parser = new TextSubmissionParser();

            console.log('[EVAL] Step 2: parser initialized');

            const parsed = parser.parse(content);

            console.log('[EVAL] Step 2 complete: submission parsed');
            console.log(
                '[EVAL] Parsed submission:',
                JSON.stringify(parsed)
            );

            // ---------------------------------------------------------
            // 3. RUN EVALUATION ENGINE
            // ---------------------------------------------------------
            console.log('[EVAL] Step 3: initializing evaluation engine');

            const evaluator = new DeterministicEvaluationEngine();

            console.log('[EVAL] Step 3: evaluation engine initialized');
            console.log('[EVAL] Step 3: calling evaluator.evaluate()');

            const result = await evaluator.evaluate(
                attempt.problem,
                parsed
            );

            console.log('[EVAL] Step 3 complete');
            console.log('[EVAL] Overall score:', result.overallScore);
            console.log(
                '[EVAL] Categories:',
                JSON.stringify(result.categories)
            );

            // ---------------------------------------------------------
            // 4. SAVE EVALUATION
            // ---------------------------------------------------------
            console.log('[EVAL] Step 4: saving evaluation');

            const savedEvaluation = await prisma.evaluation.create({
                data: {
                    attemptId: attempt.id,
                    overallScore: result.overallScore,
                    feedbackDetails: JSON.stringify(result.categories),
                    evaluatedWithAI: false
                }
            });

            console.log('[EVAL] Step 4 complete');
            console.log(
                '[EVAL] Evaluation ID:',
                savedEvaluation.id
            );

            // ---------------------------------------------------------
            // 5. MARK ATTEMPT COMPLETED
            // ---------------------------------------------------------
            console.log('[EVAL] Step 5: marking attempt COMPLETED');

            const completedAttempt = await prisma.attempt.update({
                where: { id: attemptId },
                data: {
                    status: 'COMPLETED',
                    score: result.overallScore
                }
            });

            console.log('[EVAL] Step 5 complete');
            console.log(
                '[EVAL] Attempt status:',
                completedAttempt.status
            );
            console.log(
                '[EVAL] Attempt score:',
                completedAttempt.score
            );

            console.log('=================================================');
            console.log('[EVAL] SUCCESS processEvaluation');
            console.log('[EVAL] attemptId:', attemptId);
            console.log('=================================================');

            return completedAttempt;

        } catch (error) {

            // ---------------------------------------------------------
            // GLOBAL EVALUATION ERROR HANDLER
            // ---------------------------------------------------------
            console.error('=================================================');
            console.error('[EVAL] FAILED processEvaluation');
            console.error('[EVAL] attemptId:', attemptId);
            console.error('[EVAL] error:', error);

            if (error instanceof Error) {
                console.error('[EVAL] error name:', error.name);
                console.error('[EVAL] error message:', error.message);
                console.error('[EVAL] error stack:', error.stack);
            }

            console.error('=================================================');

            // ---------------------------------------------------------
            // IMPORTANT:
            // Always try to mark the attempt as FAILED.
            // ---------------------------------------------------------
            try {
                console.log(
                    '[EVAL] Updating attempt status to FAILED'
                );

                const failedAttempt = await prisma.attempt.update({
                    where: { id: attemptId },
                    data: {
                        status: 'FAILED'
                    }
                });

                console.log(
                    '[EVAL] Attempt successfully marked FAILED:',
                    failedAttempt.id
                );

            } catch (updateError) {

                console.error(
                    '[EVAL] CRITICAL: Could not mark attempt FAILED'
                );

                console.error(
                    '[EVAL] Failure-update error:',
                    updateError
                );

                if (updateError instanceof Error) {
                    console.error(
                        '[EVAL] Failure-update message:',
                        updateError.message
                    );

                    console.error(
                        '[EVAL] Failure-update stack:',
                        updateError.stack
                    );
                }
            }

            // Re-throw so AttemptService can also see the failure.
            throw error;
        }
    }
}