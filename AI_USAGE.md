# DesignForge: AI Usage Document

## 1. Decision: Evaluation Architecture
**AI suggestion:** Use an LLM for all evaluations (passing in the prompt directly and waiting for response).
**What I rejected:** Relying solely on the LLM without structure.
**What I accepted:** Implementing a dual-engine interface `EvaluationEngine`. Primary evaluator is `DeterministicEvaluationEngine` which uses concrete structural checks.
**Why:** Making the product heavily dependent on an external LLM ruins deterministic correctness and speed. A hybrid approach ensures the demo always works.

## 2. Decision: Database Persistence Layer
**AI suggestion:** Stick to in-memory arrays for the MVP since it's just a 2-day assignment.
**What I rejected:** Using transient mock data arrays.
**What I accepted:** Setting up SQLite with Prisma for robust relational modeling of `Problem`, `Attempt`, `Submission`, and `Evaluation`.
**Why:** Proper LLD requires showcasing how entities map correctly in an actual ORM/Persistence layer. Mock data arrays fail to demonstrate state-transition maturity.

## 3. Decision: Monolith vs Microservices
**AI suggestion:** Decouple frontend, backend API, and a background evaluation worker service via Kafka or Redis queue.
**What I rejected:** Distributed queues and microservice isolation.
**What I accepted:** A simple unified repo with Vite React app and Express backend.
**Why:** Extraneous infrastructure (Kafka/Redis/K8s) violates the instruction for an LLD-focused, lightweight MVP. We demonstrate design purity via code architecture (Interfaces, Services, Strategies) rather than network complexity.

## 4. Decision: Submission Format Parsing
**AI suggestion:** Parse ASTs to formally evaluate code submissions.
**What I rejected:** Complex compiler AST parsing for MVP timeframe.
**What I accepted:** A `SubmissionParser` abstraction that currently uses regex/structured string matching for plain-text LLD descriptions.
**Why:** Satisfies the "Extensible Interfaces" requirement without getting lost in the weeds of building a full programming language parser in two days.

## 5. Decision: UI/UX Aesthetic
**AI suggestion:** Simply use native HTML components with minimal styling to focus entirely on the backend design.
**What I rejected:** A mundane, low-effort UI.
**What I accepted:** A high-quality, dark-themed, glassmorphic UI structured with Tailwind CSS and React Router.
**Why:** The prompt explicitly mandated that the UI must "WOW the user and feel extremely premium", mimicking a true robust startup toolkit.
