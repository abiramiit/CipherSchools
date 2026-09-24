const { PrismaClient } = require('@prisma/client');
console.log('Successfully imported PrismaClient');

const prisma = new PrismaClient();

async function main() {
    console.log("PrismaClient initialized");
    const count = await prisma.problem.count();
    console.log("Database query successful, problems count: ", count);
}

main().catch(err => {
    console.error("Query failed:");
    console.error(err);
}).finally(() => {
    prisma.$disconnect();
});
