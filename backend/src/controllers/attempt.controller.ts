import { Request, Response } from 'express';
import { AttemptService } from '../services/attempt.service';

const attemptService = new AttemptService();

export class AttemptController {
    async createAttempt(req: Request, res: Response) {
        try {
            const { problemId, userId } = req.body;
            const attempt = await attemptService.createAttempt(problemId, userId || 'user-1');
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create attempt' });
        }
    }

    async getAttempt(req: Request, res: Response) {
        try {
            const attempt = await attemptService.getAttempt((req.params.id as string));
            if (!attempt) return res.status(404).json({ error: 'Not found' });
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch attempt' });
        }
    }

    async getAllAttempts(req: Request, res: Response) {
        try {
            // Mock user extraction for MVP
            const userId = 'dev-user';
            const attempts = await attemptService.getAllAttempts(userId);
            res.json(attempts);
        } catch (error) {
            res.status(500).json({ error: 'Failed' });
        }
    }

    async updateDraft(req: Request, res: Response) {
        try {
            const attempt = await attemptService.updateDraft((req.params.id as string), req.body.content);
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update draft' });
        }
    }

    async submitAttempt(req: Request, res: Response) {
        try {
            const attempt = await attemptService.submitAttempt((req.params.id as string), req.body.content);
            res.json(attempt);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getEvaluation(req: Request, res: Response) {
        try {
            const evaluation = await attemptService.getEvaluation((req.params.id as string));
            res.json(evaluation);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async retryAttempt(req: Request, res: Response) {
        try {
            const attempt = await attemptService.retryAttempt((req.params.id as string));
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retry attempt' });
        }
    }
}
