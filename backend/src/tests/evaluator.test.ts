import { describe, it, expect } from 'vitest';
import { TextSubmissionParser } from '../domain/evaluation/SubmissionParser';
import { DeterministicEvaluationEngine } from '../domain/evaluation/DeterministicEvaluationEngine';

describe('Deterministic Evaluator', () => {
    it('should correctly parse structural classes and patterns', () => {
        const parser = new TextSubmissionParser();
        const content = "class Foo {}\nclass Bar {}\nWe use the Strategy pattern here.";
        const result = parser.parse(content);

        expect(result.classes.map(c => c.name)).toEqual(['Foo', 'Bar']);
        expect(result.mentionedPatterns).toContain('strategy');
    });

    it('should evaluate and penalize missing requirements', async () => {
        const engine = new DeterministicEvaluationEngine();
        const problem: any = { concepts: 'User, Auth, Session' };

        const result = await engine.evaluate(problem, {
            classes: [{ name: 'User', methods: [] }],
            mentionedPatterns: [],
            rawText: ''
        });

        const reqCov = result.categories.find(c => c.category === 'Requirement Coverage');
        expect(reqCov).toBeDefined();
        // Missing Auth and Session so score should be low
        expect(reqCov!.score).toBeLessThan(40);
    });

    it('should correctly parse plain-text generic designs and evaluate thoroughly', async () => {
        const parser = new TextSubmissionParser();
        const content = `
ParkingLot
  - floors
  - parkingSpots
  - pricingStrategy

Vehicle
  - vehicleNumber
  - vehicleType

ParkingSpot
  - spotId
  - spotType
  - isOccupied

Ticket
  - entryTime
  - exitTime

PricingStrategy
  - calculateFee()
`;
        const parsed = parser.parse(content);

        // 3. Verify parser recognizes all core classes
        const classNames = parsed.classes.map(c => c.name);
        expect(classNames).toContain('ParkingLot');
        expect(classNames).toContain('Vehicle');
        expect(classNames).toContain('ParkingSpot');
        expect(classNames).toContain('Ticket');
        expect(classNames).toContain('PricingStrategy');

        // Execute engine evaluation
        const engine = new DeterministicEvaluationEngine();
        const problem: any = { concepts: 'Vehicle, ParkingSpot, ParkingLot, Ticket, PricingStrategy' };
        const result = await engine.evaluate(problem, parsed);

        const reqCov = result.categories.find(c => c.category === 'Requirement Coverage');
        expect(reqCov).toBeDefined();

        // 4. Verify Requirement Coverage no longer reports entities as missing
        expect(reqCov!.score).toBe(100);
        expect(reqCov!.observation).not.toContain('Missing entities');

        const respDist = result.categories.find(c => c.category === 'Responsibility Distribution');
        expect(respDist).toBeDefined();

        // 5. Verify Responsibility Distribution no longer says "No active classes evaluated."
        expect(respDist!.observation).not.toContain('No active classes evaluated');
        expect(respDist!.score).toBeGreaterThan(0);
    });
});
