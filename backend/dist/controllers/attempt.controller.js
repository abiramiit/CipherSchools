"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptController = void 0;
const attempt_service_1 = require("../services/attempt.service");
const attemptService = new attempt_service_1.AttemptService();
class AttemptController {
    async createAttempt(req, res) {
        try {
            const { problemId, userId } = req.body;
            const attempt = await attemptService.createAttempt(problemId, userId || 'user-1');
            res.json(attempt);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create attempt' });
        }
    }
    async getAttempt(req, res) {
        try {
            const attempt = await attemptService.getAttempt(req.params.id);
            if (!attempt)
                return res.status(404).json({ error: 'Not found' });
            res.json(attempt);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch attempt' });
        }
    }
    async getAllAttempts(req, res) {
        try {
            // Mock user extraction for MVP
            const userId = 'dev-user';
            const attempts = await attemptService.getAllAttempts(userId);
            res.json(attempts);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed' });
        }
    }
    async updateDraft(req, res) {
        try {
            const attempt = await attemptService.updateDraft(req.params.id, req.body.content);
            res.json(attempt);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update draft' });
        }
    }
    async submitAttempt(req, res) {
        try {
            const attempt = await attemptService.submitAttempt(req.params.id, req.body.content);
            res.json(attempt);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getEvaluation(req, res) {
        try {
            const evaluation = await attemptService.getEvaluation(req.params.id);
            res.json(evaluation);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async retryAttempt(req, res) {
        try {
            const attempt = await attemptService.retryAttempt(req.params.id);
            res.json(attempt);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retry attempt' });
        }
    }
}
exports.AttemptController = AttemptController;
