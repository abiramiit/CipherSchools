"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.problemRoutes = void 0;
const express_1 = require("express");
const problem_controller_1 = require("../controllers/problem.controller");
exports.problemRoutes = (0, express_1.Router)();
const controller = new problem_controller_1.ProblemController();
exports.problemRoutes.get('/', controller.getAll);
exports.problemRoutes.get('/:id', controller.getById);
