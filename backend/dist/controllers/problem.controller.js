"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemController = void 0;
const problem_service_1 = require("../services/problem.service");
const problemService = new problem_service_1.ProblemService();
class ProblemController {
    async getAll(req, res) {
        try {
            const problems = await problemService.getAllProblems();
            res.json(problems);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch problems' });
        }
    }
    async getById(req, res) {
        try {
            const problem = await problemService.getProblemById(req.params.id);
            if (!problem) {
                return res.status(404).json({ error: 'Problem not found' });
            }
            res.json(problem);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch problem' });
        }
    }
}
exports.ProblemController = ProblemController;
