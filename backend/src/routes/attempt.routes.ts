import { Router } from 'express';
import { AttemptController } from '../controllers/attempt.controller';

export const attemptRoutes = Router();
const controller = new AttemptController();

attemptRoutes.post('/', controller.createAttempt);
attemptRoutes.get('/', controller.getAllAttempts.bind(controller));
attemptRoutes.get('/:id', controller.getAttempt);
attemptRoutes.get('/:id/evaluation', controller.getEvaluation.bind(controller));
attemptRoutes.patch('/:id', controller.updateDraft);
attemptRoutes.post('/:id/submit', controller.submitAttempt);
attemptRoutes.post('/:id/retry', controller.retryAttempt);
