import express from 'express';
import cors from 'cors';
import { problemRoutes } from './routes/problem.routes';
import { attemptRoutes } from './routes/attempt.routes';

const app = express();

const allowedOrigins = [
    "https://cipher-schools-delta.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL
].filter(Boolean) as string[];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

app.use(express.json());

app.use('/api/problems', problemRoutes);
app.use('/api/attempts', attemptRoutes);

import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: `file:${path.join(__dirname, '../prisma/dev.db')}`
        }
    }
});

app.get('/api/health/db', async (req, res) => {
    try {
        const count = await prisma.problem.count();
        res.json({ database: "connected", problemCount: count });
    } catch (e: any) {
        res.status(500).json({ database: "error", error: e.message });
    }
});

export { app };
