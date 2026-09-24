"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const problem_routes_1 = require("./routes/problem.routes");
const attempt_routes_1 = require("./routes/attempt.routes");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express_1.default.json());
app.use('/api/problems', problem_routes_1.problemRoutes);
app.use('/api/attempts', attempt_routes_1.attemptRoutes);
