import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../prisma';
import { DeterministicEvaluationEngine } from '../domain/evaluation/DeterministicEvaluationEngine';

let problemId: string;
let attemptId: string;

describe('FINAL ENGINEERING AUDIT - DesignForge', () => {

    beforeAll(async () => {
        // 1. Setup mock problem
        const p = await prisma.problem.create({
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

    afterAll(async () => {
        // Clean up
        await prisma.evaluation.deleteMany();
        await prisma.submission.deleteMany();
        await prisma.attempt.deleteMany();
        await prisma.problem.deleteMany();
        await prisma.$disconnect();
    });

    // 1. Problem retrieval
    it('1. GET /api/problems - Problem Retrieval', async () => {
        const res = await request(app).get('/api/problems');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    // 2. Attempt creation
    it('2. POST /api/attempts - Attempt Creation', async () => {
        const res = await request(app).post('/api/attempts').send({ problemId, userId: 'testId' });
        expect(res.status).toBe(200);
        expect(res.body.id).toBeDefined();
        expect(res.body.status).toBe('DRAFT');
        attemptId = res.body.id;
    });

    // 3. Draft saving & 12. API validation
    it('3. PATCH /api/attempts/:id - Draft Saving & 12. API Validation', async () => {
        const res = await request(app).patch(`/api/attempts/${attemptId}`).send({ content: 'class DraftClass {}' });
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(attemptId);
    });

    // 4. Empty submission rejection
    it('4. POST /api/attempts/:id/submit - Empty submission rejection', async () => {
        const res = await request(app).post(`/api/attempts/${attemptId}/submit`).send({ content: '' });
        expect(res.status).toBe(400); // Bad Request manually thrown
        expect(res.body.error).toMatch(/empty/i);
    });

    // 5. Submission & 10. Invalid attempt state
    it('5. POST /api/attempts/:id/submit - Submission & 10. Invalid State Check', async () => {
        const res = await request(app).post(`/api/attempts/${attemptId}/submit`).send({ content: 'class Final{}' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('EVALUATING');

        // Resubmit should fail (Invalid state)
        const res2 = await request(app).post(`/api/attempts/${attemptId}/submit`).send({ content: 'class Final2{}' });
        expect(res2.status).toBe(400);
    });

    it('5.5 POST /api/attempts/:id/submit - Submission from DB fallback', async () => {
        // Create fresh attempt
        const postRes = await request(app).post('/api/attempts').send({ problemId, userId: 'testId3' });
        const newId = postRes.body.id;

        // PATCH it
        await request(app).patch(`/api/attempts/${newId}`).send({ content: 'class ParkingLot {}' });

        // POST without content
        const submitRes = await request(app).post(`/api/attempts/${newId}/submit`);
        expect(submitRes.status).toBe(200);
        expect(submitRes.body.status).toBe('EVALUATING');
    });

    // Case D: Extensibility (Strategy pattern logic check directly on Engine)
    it('CASE D: Submission containing interfaces and strategies', async () => {
        const engine = new DeterministicEvaluationEngine();
        const prob: any = { concepts: 'Vehicle' };
        const result = await engine.evaluate(prob, {
            classes: [{ name: 'Vehicle', methods: [] }],
            mentionedPatterns: ['strategy', 'factory'],
            rawText: 'Strategy used'
        });

        const ext = result.categories.find(c => c.category === 'Extensibility');
        expect(ext!.score).toBeGreaterThan(90);
        expect(ext!.observation).toContain('pattern');
    });

    // Case B & 8. Responsibility detection & Case C & 7. Missing concept
    it('CASE B, C, 7, 8: God class penalization and Missing Entity Detection', async () => {
        const engine = new DeterministicEvaluationEngine();
        const prob: any = { concepts: 'Vehicle, ParkingLot, Ticket, Floor' }; // floor missing in submission
        const result = await engine.evaluate(prob, {
            classes: [{
                name: 'ParkingLot',
                methods: ['allocateSpot', 'parkVehicle', 'calculatePricing', 'notifyAdmin', 'createTicket'] // 5 verbs handling unrelated things
            }],
            mentionedPatterns: [],
            rawText: 'class ParkingLot...'
        });

        const resp = result.categories.find(c => c.category === 'Responsibility Distribution');
        expect(resp!.score).toBeLessThanOrEqual(40);
        expect(resp!.suggestion).toContain('Decompose ParkingLot');

        const req = result.categories.find(c => c.category === 'Requirement Coverage');
        expect(req!.score).toBeLessThan(100);
        expect(req!.observation).toContain('Missing entities');
        expect(req!.observation.toLowerCase()).toContain('floor');
    });

    // Case A & 6. Deterministic evaluation success
    it('CASE A & 6: Strong architecture design evaluation', async () => {
        const engine = new DeterministicEvaluationEngine();
        const prob: any = { concepts: 'Vehicle, Ticket, Spot' };
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
        expect(req!.score).toBe(100);
        const resp = result.categories.find(c => c.category === 'Responsibility Distribution');
        expect(resp!.score).toBeGreaterThan(80);
    });

    // 9. Retry creates a new attempt
    it('9. POST /api/attempts/:id/retry - Retry attempt', async () => {
        const res = await request(app).post(`/api/attempts/${attemptId}/retry`);
        expect(res.status).toBe(200);
        expect(res.body.id).not.toBe(attemptId);
        expect(res.body.problemId).toBe(problemId);
    });

    // 11. Evaluation failure handling 
    it('11. GET /api/attempts/:id/evaluation - Missing Evaluation handling', async () => {
        // Create fresh attempt and fetch eval which shouldn't exist
        const at = await request(app).post('/api/attempts').send({ problemId, userId: 'dev-user' });
        const res = await request(app).get(`/api/attempts/${at.body.id}/evaluation`);
        expect(res.status).toBe(400); // No eval generated yet
    });
});
