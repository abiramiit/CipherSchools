import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service';

const problemService = new ProblemService();

export class ProblemController {
    async getAll(req: Request, res: Response) {
        try {
            const problems = await problemService.getAllProblems();
            res.json(problems);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch problems' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const problem = await problemService.getProblemById(req.params.id);
            if (!problem) {
                return res.status(404).json({ error: 'Problem not found' });
            }
            res.json(problem);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch problem' });
        }
    }
}
