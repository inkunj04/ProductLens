# Community-Driven Product Review Platform

A small full-stack working prototype for a community-driven product review platform.

## Core Idea
Reviews are structured as mini product analyses focused on use-case fit, trade-offs, and signals, not rants.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Frontend**: React
- **API Style**: REST

## Engineering Rationale & Trade-offs

### 1. High-Level System Architecture
**Frontend (React) -> Backend (Node.js + Express) -> Database (SQLite)**

*   **REST API**: Chosen for simplicity and standard resource-oriented design suitable for this scope.
*   **SQLite**: Chosen for zero-configuration persistence. No separate database process needed.
*   **Aggregation at Read Time**: Average ratings are calculated via SQL `AVG()` queries when fetching products.
    *   *Trade-off*: For extremely high write volumes, this might be slower than pre-aggregating. However, for a prototype and even moderate scale, it ensures 100% data consistency without complex cache invalidation or update logic.

### 2. Data Models
*   **Product**: Core entity.
*   **Review**: The value unit. Structured with `problem_solved`, `what_worked`, `what_didnt` to enforce high-quality feedback.
*   **User**: Mocked for this prototype to focus on the review mechanics.

### 3. Scope & Artificial Constraints
*   **No Authentication**: To reduce friction for the prototype.
*   **Basic Styling**: Focus is on functionality and structure, not polished aesthetics.
*   **In-Memory/Local SQL**: Simplifies deployment and testing.

## Product Refinement (Phase 2)
### Key Features
1.  **Intent Tags**: Users evaluate products differently based on their goal (Exploring, Evaluating, Daily Use, Power User). This context is now captured and displayed.
2.  **Trade-off Snapshot**: Structure ensures "What Worked" and "What Didn't" are explicitly separated, plus an optional "Unexpected Insight".
3.  **Rating Distribution**: Averages hide polarity. The distribution bar reveals if a product is polarizing (e.g., love/hate) or consistently average.

### Engineering Rationale
-   **Schema Evolution**: Added `intent` and `unexpected_insight` columns.
-   **Data Integrity**: Check constraints on `intent` ensure valid enum values at the DB level.
-   **Aggregation**: Rating distribution is calculated on-the-fly for simplicity, ensuring real-time consistency without complex counters.

## How to Run
1.  **Backend**:
    ```bash
    cd server
    npm install
    node index.js
    ```
2.  **Frontend**:
    ```bash
    cd client
    npm install
    npm run dev
    ```
