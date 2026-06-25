# Situ Caregiver Shift Monitoring Prototype

## Overview

This project is a frontend prototype created for a Product Case Study.

It demonstrates a proposed solution for anticipating caregiver delays and absences before they affect the family or the older adult.

The prototype focuses on product behavior, user flow, and operational clarity.

It is not a production application.

---

# Product Context

Situ provides in-home care for older adults.

One operational issue occurs when a caregiver does not arrive on time and Situ only learns about the problem after the family calls.

This prototype explores a real-time detection and operational response flow.

The selected solution focuses on:

- Trip start confirmation.
- Periodic location updates.
- ETA estimation.
- Delay detection.
- Family communication.
- Replacement workflow.
- Check-in.
- Shift handoff.

---

# Prototype Scope

The prototype includes three perspectives:

- Caregiver
- Operations
- Family

All data is mocked.

There is no backend.

There is no authentication.

There is no real GPS.

There is no database.

---

# Main Flow

1. The caregiver sees today's shift.
2. The caregiver starts the trip.
3. The system simulates location updates every 15 minutes.
4. The system estimates ETA.
5. A delay can be simulated.
6. Operations receives the risk signal.
7. The family sees the updated ETA.
8. A replacement can be requested.
9. A replacement caregiver can be assigned.
10. The caregiver checks in.
11. The caregiver completes the shift handoff form.

---

# Technology

- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Router
- Lucide Icons
- Vitest
- React Testing Library

---

# Code Quality

The codebase should be intentionally structured.

Business constants live in:

```txt
src/config/constants.ts
```

Routes live in:

```txt
src/config/routes.ts
```

Status labels live in:

```txt
src/config/status.ts
```

User-facing copy lives in:

```txt
src/content/copy.ts
```

Mock data lives in:

```txt
src/data/
```

Business logic lives in:

```txt
src/lib/
```

Tests live close to the code they validate.

---

# Testing

Run tests with:

```bash
npm run test
```

Run coverage with:

```bash
npm run test:coverage
```

The project should include tests for:

- ETA calculation.
- Risk level calculation.
- Replacement ranking.
- Main dashboard rendering.
- Family delay decision flow.
- Handoff form submission.

---

# Design Principles

The interface should feel:

- calm
- trustworthy
- clear
- healthcare oriented
- operationally useful

The UI should prioritize clarity over visual complexity.

---

# Implementation Notes

This is a clickable product prototype.

The goal is to communicate the proposed solution, not to implement real infrastructure.

Claude Code may be used to generate the implementation, but the repository should remain readable, typed, and maintainable.