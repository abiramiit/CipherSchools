import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.problem.createMany({
            data: [
                {
                    title: "Parking Lot",
                    slug: "parking-lot",
                    difficulty: "Medium",
                    estimatedMinutes: 45,
                    description: "Design a parking lot with multiple floors, different vehicle types, and a fee calculation system.",
                    requirements: "1. Multiple floors/levels.\n2. Support different vehicle types (Motorcycle, Car, Bus).\n3. Spots allocated near entry.\n4. Fees calculated based on parking time.",
                    concepts: "Vehicle, ParkingSpot, ParkingFloor, Ticket, PricingStrategy",
                    evaluationCriteria: "Evaluates abstraction of spot types, strategy for pricing, and correct entity relationships."
                },
                {
                    title: "Vending Machine",
                    slug: "vending-machine",
                    difficulty: "Hard",
                    estimatedMinutes: 60,
                    description: "Design a state-based vending machine that handles product selection, payment insertion, dispensing, and change returning.",
                    requirements: "1. Support states: Idle, HasMoney, Dispensing, ChangeReturned.\n2. Track inventory.\n3. Validate coins/notes.",
                    concepts: "VendingMachine, State, Item, Inventory, Transaction",
                    evaluationCriteria: "Evaluates the strict usage of State Pattern and inventory tracking."
                },
                {
                    title: "Library Management System",
                    slug: "library-management",
                    difficulty: "Medium",
                    estimatedMinutes: 40,
                    description: "Design a system for a library where users can check out books, return them, and get fined for late returns.",
                    requirements: "1. Distinguish between Book and physical BookItem/Copy.\n2. Member checkout logic with holding limits.\n3. Late fee calculation.",
                    concepts: "Book, BookItem, Member, Reservation, Fine",
                    evaluationCriteria: "Focuses on correct relationship mapping between general Book and physical BookItem."
                }
            ]
        });
        console.log("Seeded problems successfully");
    } catch (error) {
        console.log("Seed skipped or problems exist");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
