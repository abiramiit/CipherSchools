"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const prisma_1 = require("../prisma");
const DeterministicEvaluationEngine_1 = require("../domain/evaluation/DeterministicEvaluationEngine");
let problemId;
let attemptId;
(0, vitest_1.describe)('FINAL ENGINEERING AUDIT - DesignForge', () => {
    (0, vitest_1.beforeAll)(async () => {
        // 1. Setup mock problem
        const p = await prisma_1.prisma.problem.create({
            data: {
                title: "Test Parking Lot",
                slug: "test-parking",
                difficulty: "Medium",
                estimatedMinutes: 60,
                description: "Desc",
                requirements: "Reqs",
                concepts: "Vehicle, ParkingLot, Ticket",
                evaluationCriteria: "Eval"
            }
        });
        problemId = p.id;
    });
    (0, vitest_1.afterAll)(async () => {
        // Clean up
        await prisma_1.prisma.evaluation.deleteMany();
        await prisma_1.prisma.submission.deleteMany();
        await prisma_1.prisma.attempt.deleteMany();
        await prisma_1.prisma.problem.deleteMany();
        await prisma_1.prisma.$disconnect();
    });
    // 1. Problem retrieval
    (0, vitest_1.it)('1. GET /api/problems - Problem Retrieval', async () => {
        const res = await (0, supertest_1.default)(app_1.app).get('/api/problems');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(res.body)).toBeTruthy();
    });
    // 2. Attempt creation
    (0, vitest_1.it)('2. POST /api/attempts - Attempt Creation', async () => {
        const res = await (0, supertest_1.default)(app_1.app).post('/api/attempts').send({ problemId, userId: 'testId' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.id).toBeDefined();
        (0, vitest_1.expect)(res.body.status).toBe('DRAFT');
        attemptId = res.body.id;
    });
    // 3. Draft saving & 12. API validation
    (0, vitest_1.it)('3. PATCH /api/attempts/:id - Draft Saving & 12. API Validation', async () => {
        const res = await (0, supertest_1.default)(app_1.app).patch(`/api/attempts/${attemptId}`).send({ content: 'class DraftClass {}' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.id).toBe(attemptId);
    });
    // 4. Empty submission rejection
    (0, vitest_1.it)('4. POST /api/attempts/:id/submit - Empty submission rejection', async () => {
        const res = await (0, supertest_1.default)(app_1.app).post(`/api/attempts/${attemptId}/submit`).send({ content: '' });
        (0, vitest_1.expect)(res.status).toBe(400); // Bad Request manually thrown
        (0, vitest_1.expect)(res.body.error).toMatch(/empty/i);
    });
    // 5. Submission & 10. Invalid attempt state
    (0, vitest_1.it)('5. POST /api/attempts/:id/submit - Submission & 10. Invalid State Check', async () => {
        const res = await (0, supertest_1.default)(app_1.app).post(`/api/attempts/${attemptId}/submit`).send({ content: 'class Final{}' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.status).toBe('EVALUATING');
        // Resubmit should fail (Invalid state)
        const res2 = await (0, supertest_1.default)(app_1.app).post(`/api/attempts/${attemptId}/submit`).send({ content: 'class Final2{}' });
        (0, vitest_1.expect)(res2.status).toBe(400);
    });
    // Case D: Extensibility (Strategy pattern logic check directly on Engine)
    (0, vitest_1.it)('CASE D: Submission containing interfaces and strategies', async () => {
        const engine = new DeterministicEvaluationEngine_1.DeterministicEvaluationEngine();
        const prob = { concepts: 'Vehicle' };
        const result = await engine.evaluate(prob, {
            classes: [{ name: 'Vehicle', methods: [] }],
            mentionedPatterns: ['strategy', 'factory'],
            rawText: 'Strategy used'
        });
        const ext = result.categories.find(c => c.category === 'Extensibility');
        (0, vitest_1.expect)(ext.score).toBeGreaterThan(90);
        (0, vitest_1.expect)(ext.observation).toContain('pattern');
    });
    // Case B & 8. Responsibility detection & Case C & 7. Missing concept
    (0, vitest_1.it)('CASE B, C, 7, 8: God class penalization and Missing Entity Detection', async () => {
        const engine = new DeterministicEvaluationEngine_1.DeterministicEvaluationEngine();
        const prob = { concepts: 'Vehicle, ParkingLot, Ticket, Floor' }; // floor missing in submission
        const result = await engine.evaluate(prob, {
            classes: [{
                    name: 'ParkingLot',
                    methods: ['allocateSpot', 'parkVehicle', 'calculatePricing', 'notifyAdmin', 'createTicket'] // 5 verbs handling unrelated things
                }],
            mentionedPatterns: [],
            rawText: 'class ParkingLot...'
        });
        const resp = result.categories.find(c => c.category === 'Responsibility Distribution');
        (0, vitest_1.expect)(resp.score).toBeLessThanOrEqual(40);
        (0, vitest_1.expect)(resp.suggestion).toContain('Decompose ParkingLot');
        const req = result.categories.find(c => c.category === 'Requirement Coverage');
        (0, vitest_1.expect)(req.score).toBeLessThan(100);
        (0, vitest_1.expect)(req.observation).toContain('Missing entities');
        (0, vitest_1.expect)(req.observation.toLowerCase()).toContain('floor');
    });
    // Case A & 6. Deterministic evaluation success
    (0, vitest_1.it)('CASE A & 6: Strong architecture design evaluation', async () => {
        const engine = new DeterministicEvaluationEngine_1.DeterministicEvaluationEngine();
        const prob = { concepts: 'Vehicle, Ticket, Spot' };
        const result = await engine.evaluate(prob, {
            classes: [
                { name: 'Vehicle', methods: ['getLicense'] },
                { name: 'Ticket', methods: ['calculateCost'] },
                { name: 'Spot', methods: ['isFree'] },
            ],
            mentionedPatterns: ['factory'],
            rawText: 'Good classes'
        });
        const req = result.categories.find(c => c.category === 'Requirement Coverage');
        (0, vitest_1.expect)(req.score).toBe(100);
        const resp = result.categories.find(c => c.category === 'Responsibility Distribution');
        (0, vitest_1.expect)(resp.score).toBeGreaterThan(80);
    });
    // 9. Retry creates a new attempt
    (0, vitest_1.it)('9. POST /api/attempts/:id/retry - Retry attempt', async () => {
        const res = await (0, supertest_1.default)(app_1.app).post(`/api/attempts/${attemptId}/retry`);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.id).not.toBe(attemptId);
        (0, vitest_1.expect)(res.body.problemId).toBe(problemId);
    });
    // 11. Evaluation failure handling 
    (0, vitest_1.it)('11. GET /api/attempts/:id/evaluation - Missing Evaluation handling', async () => {
        // Create fresh attempt and fetch eval which shouldn't exist
        const at = await (0, supertest_1.default)(app_1.app).post('/api/attempts').send({ problemId, userId: 'dev-user' });
        const res = await (0, supertest_1.default)(app_1.app).get(`/api/attempts/${at.body.id}/evaluation`);
        (0, vitest_1.expect)(res.status).toBe(400); // No eval generated yet
    });
});
