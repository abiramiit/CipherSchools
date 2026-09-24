import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';

export const problemRoutes = Router();
const controller = new ProblemController();

problemRoutes.get('/', controller.getAll);
problemRoutes.get('/:id', controller.getById);
