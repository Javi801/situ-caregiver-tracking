# Architecture

## Philosophy

Build a clean frontend prototype with maintainable structure.

The project is small, but the code should be organized as if it could evolve into a real product.

Prioritize:

- Readability.
- Clear separation of concerns.
- Typed data.
- Reusable components.
- Testable helper functions.

---

# Folder Structure

Use the following structure:

```txt
src/
  app/
    App.tsx
    router.tsx

  components/
    layout/
    cards/
    feedback/
    forms/
    ui/

  pages/
    Home/
    CaregiverDashboard/
    TripTracking/
    OperationsDashboard/
    FamilyStatus/
    ReplacementFlow/
    CheckIn/
    HandoffForm/

  config/
    routes.ts
    constants.ts
    status.ts
    theme.ts

  content/
    copy.ts

  data/
    caregivers.ts
    families.ts
    shifts.ts

  hooks/

  lib/
    eta.ts
    risk.ts
    replacements.ts
    format.ts

  types/
    index.ts

  test/
    setup.ts
```

---

# Configuration Files

## src/config/routes.ts

Contains all route paths.

Example:

```ts
export const ROUTES = {
  home: "/",
  caregiver: "/caregiver",
  tracking: "/tracking",
  operations: "/operations",
  family: "/family",
  replacement: "/replacement",
  checkIn: "/checkin",
  handoff: "/handoff",
} as const;
```

## src/config/constants.ts

Contains business constants.

Example:

```ts
export const LOCATION_UPDATE_INTERVAL_MINUTES = 15;
export const SHORT_DISTANCE_THRESHOLD_MINUTES = 20;
export const HANDOFF_WINDOW_MINUTES = 15;
export const DELAY_THRESHOLD_MINUTES = 10;
```

## src/config/status.ts

Contains shift status definitions, labels, and badge variants.

Do not hardcode status text in pages.

## src/config/theme.ts

Contains semantic color tokens used by the app.

Do not hardcode raw color values across components.

Use semantic names such as:

- success
- warning
- danger
- neutral
- healthcare
- muted

---

# Content

## src/content/copy.ts

All user-facing text should live here.

Examples:

- Page titles.
- Button labels.
- Empty states.
- Warning messages.
- Toast messages.
- Field labels.

Avoid writing user-facing strings directly inside page components unless they are trivial and used once.

---

# Types

Define domain types in `src/types/index.ts`.

Required types:

```ts
export type ShiftStatus =
  | "scheduled"
  | "trip_started"
  | "delay_detected"
  | "replacement_requested"
  | "replacement_assigned"
  | "arrived"
  | "shift_started"
  | "completed";

export type RiskLevel = "low" | "medium" | "high";

export interface Caregiver {
  id: string;
  name: string;
  reliabilityScore: number;
  distanceKm: number;
  etaMinutes: number;
  certifications: string[];
}

export interface Family {
  id: string;
  name: string;
  address: string;
  olderAdultName: string;
  notes: string;
}

export interface Shift {
  id: string;
  caregiverId: string;
  familyId: string;
  startsAt: string;
  status: ShiftStatus;
  etaMinutes: number;
}
```

---

# Business Logic

Business logic must live in `src/lib`.

Do not place calculations directly inside components.

## eta.ts

Responsible for ETA formatting and delay calculation.

## risk.ts

Responsible for determining risk level.

## replacements.ts

Responsible for ranking replacement caregivers.

Replacement ranking may consider:

- ETA.
- Distance.
- Reliability score.
- Availability.

---

# Components

Prefer small reusable components.

Suggested components:

```txt
StatusBadge
ShiftCard
ETAWidget
RiskBanner
MapPlaceholder
ReplacementCard
ActorCard
PageShell
ActionPanel
HandoffField
```

Page components should compose these components instead of containing large JSX blocks.

---

# State Management

Use `useState` for screen state.

Use React Context only for shared current shift state if needed.

Do not use Redux.

Do not introduce server state tools.

---

# Routing

Use React Router.

Required routes:

```txt
/
 /caregiver
 /tracking
 /operations
 /family
 /replacement
 /checkin
 /handoff
```

---

# Testing Architecture

Use Vitest and React Testing Library.

Test pure functions in `src/lib`.

Test main user flows at the page level.

Minimum test files:

```txt
src/lib/eta.test.ts
src/lib/risk.test.ts
src/lib/replacements.test.ts
src/pages/CaregiverDashboard/CaregiverDashboard.test.tsx
src/pages/OperationsDashboard/OperationsDashboard.test.tsx
src/pages/FamilyStatus/FamilyStatus.test.tsx
src/pages/HandoffForm/HandoffForm.test.tsx
```

Tests should verify behavior, not implementation details.

---

# Accessibility

Use semantic HTML.

Buttons must have clear accessible names.

Inputs must have labels.

Status messages should be visible in text, not only represented by color.

---

# Styling

Use TailwindCSS and shadcn/ui.

Avoid inline styles.

Avoid duplicated Tailwind class strings when a reusable component would be clearer.

Keep the interface clean, calm, and easy to understand.

---

# Non Goals

Do not implement:

- Real GPS.
- Real maps.
- Real authentication.
- Real backend.
- Real notifications.
- Real database.
- Real role permissions.

All of these should be simulated.