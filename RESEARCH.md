# DesignForge: LLD Research & Product Definition

## 1. Problem
Software engineering interviews highly prioritize Low-Level Design (LLD), but current learning platforms focus heavily on DSA (LeetCode) or High-Level System Design. Existing LLD resources are mostly passive, such as static repositories or course articles, lacking interactive, evaluative feedback for bespoke solution designs.

## 2. Existing Approaches
- **Educational platforms (Educative, DesignGurus):** Good structured content, but mostly read-only.
- **GitHub Repos (LLD Practice):** Provide problem statements, but offer zero interactive evaluation.
- **AI Coding Tools:** Capable of generating solutions, but typically don't act as a rigorous, step-by-step evaluator evaluating user-created architecture strictly against specific LLD principles.

## 3. Observed Gaps
- **Lack of Explainable Feedback:** Most tools give a binary pass/fail or don't evaluate at all. We need structured scoring (e.g., Encapsulation, Extensibility, etc.).
- **Absence of Iterative Loops:** Real LLD is iterative. Tools rarely allow the user to receive feedback, adjust the design, and try again in an organized workflow.
- **Overemphasis on A Single "Correct" Design:** LLD often has multiple valid solutions driven by different trade-offs.

## 4. Target Learner
Mid-level software engineers and active interview candidates looking to practice object-oriented modeling, class design, and design patterns systematically.

## 5. Product Opportunity
An interactive workspace that simulates a real LLD interview:
Provide clear requirements → Offer a focused design workspace (Classes, Relationships, Patterns) → Generate an explainable, deterministic + AI feedback loop → Encourage iterative retry.

## 6. MVP Decision
- **Core Loop:** Problem → Attempt → Submit → Evaluate → Feedback → Retry.
- **Stack Constraint:** Single monolithic application (React + Node.js/Express + SQLite). Avoid microservices array to prioritize speed and reliability for a 2-day assignment.
- **Dual Evaluation:** Provide a robust `DeterministicEvaluationEngine` analyzing structural keywords and class overlaps, augmented by an optional `AIEvaluationEngine` for qualitative, trade-off-based reasoning.
