import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

async function startServer() {
    console.log("================ DIAGNOSTICS ================");
    console.log("Database provider: sqlite");
    console.log("Current working directory:", process.cwd());
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@') || "Not explicitly set in env");
    try {
        const count = await prisma.problem.count();
        console.log("Problem count at startup:", count);
    } catch (e: any) {
        console.log("Database query failed at startup:", e.message);
    }
    console.log("=============================================");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch(console.error);
