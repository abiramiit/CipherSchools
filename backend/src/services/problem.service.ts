import { prisma } from '../prisma';

export class ProblemService {
    async getAllProblems() {
        return prisma.problem.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                estimatedMinutes: true,
                description: true,
                concepts: true,
            }
        });
    }

    async getProblemById(id: string) {
        return prisma.problem.findUnique({
            where: { id }
        });
    }
}
