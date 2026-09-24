# DesignForge - LLD Practice Platform

Welcome to DesignForge, a fully functional MVP for practicing Low-Level Design problems through interactive, structured architectural workspaces.

## Features
- **Problem Library:** Curated architectural challenges (e.g., Vending Machine, Parking Lot).
- **Interactive Workspace:** Draft, iterate, and submit LLD designs via text and pseudo-code.
- **Explainable Feedback Loop:** Get scored based on responsibilities, extensibility, and patterns rather than vague auto-grading.
- **Determinism First:** Grading works primarily deterministically to bypass AI timeout/dependency issues, with an abstracted `AIEvaluationEngine` layer ready for API keys.
- **Progress Tracking:** History tracking and iterative attempts.

## Architecture & Domain Model
Monolithic Design favoring Domain-Driven principles:
- **Client:** React (Vite) + Tailwind CSS + React Router
- **Server:** Node.js (Express) + Prisma + SQLite

Core domains cleanly separated into Service layers with an `EvaluationEngine` and `SubmissionParser` to ensure Open/Closed principles.

## Project Structure
```
backend/
  prisma/
    schema.prisma         # Database models
  src/
    domain/
      evaluation/         # Evaluation engines & parsers
    controllers/          # Express route controllers
    services/             # Application business logic
    routes/               # HTTP mapping
    tests/                # Vitest coverage
web/
  src/
    pages/                # React container components
    index.css             # Glassmorphism & SaaS theming
```

## Setup & Running Locally

### Backend
1. `cd backend`
2. `npm install`
3. `npx prisma db push` (Sets up SQLite)
4. `npx tsx seed.ts` (Populate seed data)
5. `npx tsx src/index.ts` (Runs server on 3001)

### Frontend
1. `cd web`
2. `npm install`
3. `npm run dev` (Runs on 5173 or default vite port)

## Technical Trade-offs
1. **Monolith vs Microservices:** Chosen deliberately for speed of deployment and stability.
2. **Deterministic Over AI:** We use simple regex rule-matching as the base `EvaluationEngine`. The `AIEvaluationEngine` implements the exact same interface, showing clear capability for seamless LLM pluggability.

## Future Improvements
- **Mermaid Graph Visualizations:** Expand upon the visual feedback mechanism.
- **AST Parsing:** Implement a `CodeSubmissionParser` mapping real TypeScript code into object models.
- **JWT Authentication:** Add actual multi-tenant auth (MVP utilizes a single mocked `dev-user`).
