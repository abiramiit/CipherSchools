"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemService = void 0;
const prisma_1 = require("../prisma");
class ProblemService {
    async getAllProblems() {
        return prisma_1.prisma.problem.findMany({
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
    async getProblemById(id) {
        return prisma_1.prisma.problem.findUnique({
            where: { id }
        });
    }
}
exports.ProblemService = ProblemService;
