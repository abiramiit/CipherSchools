import express from 'express';
import { problemRoutes } from './routes/problem.routes';
import { attemptRoutes } from './routes/attempt.routes';

const app = express();


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
        res.json({ database: "connected", problemCount: count, version: "cors-fix-v3" });
    } catch (e: any) {
        res.status(500).json({ database: "error", error: e.message });
    }
});

export { app };
