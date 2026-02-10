# ProductLens  
Community-Driven Product Review Platform (Prototype)

ProductLens is a small full-stack working prototype for a **community-driven product review platform** where reviews are treated as **mini product analyses**, not opinion dumps.

The focus is on **use-case fit, trade-offs, and real signals**, helping users make informed decisions with fewer but higher-quality reviews.

This project is intentionally scoped as a prototype for evaluation purposes.

---

## Core Idea

Most review platforms prioritize star ratings and free-text comments, which often results in emotional, low-context feedback.

ProductLens takes a different approach:
- Reviews are **structured**
- Context is explicit
- Trade-offs are encouraged
- Ratings are supporting signals, not the main artifact

The goal is to help users *think better*, not scroll longer.

---

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: SQLite
- **API Style**: REST

---

## System Architecture

**Frontend (React) → Backend (Node.js + Express) → Database (SQLite)**

### Architectural Decisions

- **REST APIs**  
  Chosen for simplicity and clarity. Resource-oriented endpoints are easy to reason about and sufficient for this scope.

- **SQLite**  
  Used for zero-configuration persistence. No separate database service is required, making the prototype easy to run locally.

- **Aggregation at Read Time**  
  Average ratings and rating distributions are computed using SQL queries (`AVG`, `COUNT`) when data is fetched.
  
  **Trade-off**:  
  This would be less optimal at very large scale, but it guarantees data consistency and avoids premature optimization, which is appropriate for a prototype.

---

## Data Models

- **Product**  
  Core entity being evaluated.

- **Review**  
  The primary value unit. Reviews are structured to capture:
  - Usage intent
  - Problem the user was trying to solve
  - What worked
  - What didn’t
  - Optional unexpected insight

- **User**  
  Mocked for this prototype to keep focus on review mechanics rather than identity management.

---

## Key Features Implemented

### 1. Structured Reviews
Reviews are intentionally split into clear sections to reduce noise and encourage thoughtful input.

### 2. Intent-Based Context
Each review captures *how* the product was used:
- Exploring
- Evaluating
- Daily Use
- Power User

Users can filter reviews by intent to find feedback relevant to their situation.

### 3. Rating Distribution
In addition to average rating, the system displays rating distribution to expose disagreement or polarization instead of hiding it behind a single number.

### 4. Minimal, Analytical UI
The interface is calm and distraction-free, designed to support comparison and reasoning rather than emotional reactions.

---

## Engineering Rationale & Trade-offs

- **No Authentication**  
  Deliberately excluded to reduce friction and keep focus on the review model.

- **Basic Styling**  
  Visual polish is intentionally limited. Priority is given to information hierarchy and clarity over aesthetics.

- **Local SQL Database**  
  Simplifies development, testing, and evaluation. No deployment complexity.

- **Schema Evolution**  
  Fields such as `intent` and `unexpected_insight` were added as the product idea evolved.
  
  - Intent values are constrained at the database level to ensure data integrity.
  - Rating aggregates are recalculated dynamically for correctness and simplicity.

---

## Project Structure

```text
Task_2/
├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
├── public/
├── server/
│   ├── index.js
│   ├── db.js
│   ├── seed.js
│   └── reviews.db
├── README.md
├── package.json
└── vite.config.js

```


## How to Run the Project

### Backend

```bash
cd server
npm install
node index.js
```

### Frontend
```bash

cd client
npm install
npm run dev


