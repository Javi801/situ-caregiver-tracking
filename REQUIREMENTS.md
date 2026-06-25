# Requirements

## Goal

Build a clickable frontend prototype for the caregiver tracking solution proposed for Situ.

The application is not production ready, but the codebase must be clean, typed, maintainable, and structured as if it could evolve into a real product.

No backend is required.

No authentication is required.

No database is required.

All data must be mocked.

---

# Technology

Use:

- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Router
- Lucide Icons
- Vitest
- React Testing Library

Do not use Redux.

Use React Context only if it clearly simplifies shared state.

---

# Code Quality Requirements

The implementation must follow these rules:

- Use TypeScript for all application code.
- Avoid `any`.
- Keep components small and focused.
- Avoid duplicated strings.
- Avoid duplicated color values.
- Avoid hardcoded user-facing copy inside page components.
- Avoid hardcoded business constants inside components.
- Extract mock data into dedicated files.
- Extract UI text into a dedicated copy file.
- Extract colors, status labels, route names, and business constants into dedicated files.
- Prefer pure helper functions for business logic.
- Keep page components mostly responsible for composition.
- Use descriptive variable names.
- Do not leave unused code.
- Do not leave console logs.
- Do not add fake backend abstractions unless needed.

---

# Required Project Files

The project must include at least:

```txt
src/config/routes.ts
src/config/constants.ts
src/config/status.ts
src/config/theme.ts

src/content/copy.ts

src/data/caregivers.ts
src/data/families.ts
src/data/shifts.ts

src/types/index.ts

src/lib/eta.ts
src/lib/risk.ts
src/lib/replacements.ts

src/test/setup.ts
```

---

# Testing Requirements

Add tests using Vitest and React Testing Library.

At minimum, implement tests for:

- ETA calculation.
- Delay risk calculation.
- Replacement suggestion logic.
- Caregiver dashboard rendering.
- Operations dashboard rendering.
- Family delay decision flow.
- Shift handoff form rendering and submission.

Tests do not need to be exhaustive, but they must pass.

Add npm scripts:

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

---

# Mock Data

All information must be hardcoded.

Create fake caregivers, families, older adults, shifts, and replacement options.

No API calls.

The mock data should be realistic enough to support the full flow.

---

# Actors

The prototype includes three actors.

## Caregiver

Can:

- See today's shift.
- Start trip.
- Update location.
- See ETA.
- Check in.
- Fill shift handoff form.

## Operations

Can:

- Monitor active shifts.
- Detect late arrivals.
- See ETA.
- See risk level.
- Find replacement caregivers.
- Assign replacement.

## Family

Can:

- See caregiver ETA.
- Receive delay notification.
- Decide to wait.
- Request replacement.

---

# Screens

## 1. Home

Cards for:

- Caregiver
- Operations
- Family

Selecting one opens its workflow.

## 2. Caregiver Dashboard

Show:

- Today's shift.
- Older adult name.
- Family name.
- Address.
- Start time.
- Current status.
- Button: Start Trip.

## 3. Trip Tracking

Show:

- Current ETA.
- Distance.
- Status.
- Map placeholder.
- Text explaining that location updates every 15 minutes.

Include:

- Button: Simulate Delay.
- Button: Check In.

## 4. Delay State

After pressing Simulate Delay, show:

- New ETA.
- Delay warning.
- Operations notified.
- Family notified.
- Button: Continue.

## 5. Operations Dashboard

Show:

- Shift status.
- ETA.
- Risk level.
- Replacement suggestions.
- Button: Contact Family.
- Button: Assign Replacement.

## 6. Family Screen

Show:

- Current caregiver.
- Estimated arrival.
- Delay message.
- Button: Wait.
- Button: Request Replacement.

## 7. Replacement Flow

Show:

- Suggested caregiver.
- Distance.
- ETA.
- Match notes.
- Button: Accept replacement.
- Button: Reject replacement.

## 8. Check-in

Caregiver arrives.

Show:

- Arrival time.
- Address confirmation.
- Button: Check In.

After check-in, status changes to:

- Shift Started.

## 9. Shift Handoff Form

Fields:

- Quality of sleep.
- Mood.
- Medication changes.
- Recent events.
- Notes.

Button:

- Finish.

---

# UX Requirements

Navigation should be smooth.

Use fake loading states where useful.

Use toast notifications for important simulated events.

Use cards over tables.

Avoid long forms.

Prioritize clarity over visual complexity.

The product should feel calm, trustworthy, and healthcare oriented.

---

# Scope

This project demonstrates product behavior only.

Business logic can be simplified, but it should be isolated in helper functions.

The objective is storytelling through interaction while keeping code quality high.