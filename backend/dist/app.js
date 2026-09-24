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
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            process.env.FRONTEND_URL
        ].filter(Boolean);
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use((0, cors_1.default)(corsOptions));
app.options(/(.*)/, (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/problems', problem_routes_1.problemRoutes);
app.use('/api/attempts', attempt_routes_1.attemptRoutes);
