import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

async function startServer() {
    app.listen(Number(PORT), '0.0.0.0', async () => {
        console.log("BUILD VERSION: c120e74 + verify logs");
        console.log("DATABASE_URL:", process.env.DATABASE_URL ? "configured" : "missing");
        console.log("DATABASE PROVIDER: postgresql");
        try {
            const count = await prisma.problem.count();
            console.log("PROBLEM COUNT:", count);
        } catch (e: any) {
            console.log("PROBLEM COUNT ERROR:", e.message);
        }
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch(console.error);
