# MVPs — Build de 20 minutos con Claude

Premisa: todo se programa en ~20 min delegando en Claude. Por eso los MVPs van en
orden de dependencia, cada uno deja la app **ejecutable y testeable**, y se generan
en bloques grandes (no archivo por archivo). Tiempo objetivo por MVP entre paréntesis.

---

## MVP 0 — Scaffold + base tipada (≈4 min)

Objetivo: app que levanta con `npm run dev` y `npm run test` en verde, con toda la
infraestructura de calidad que exigen REQUIREMENTS/ARCHITECTURE.

- Vite + React + TS + Tailwind + shadcn/ui + React Router + Vitest + RTL.
- `src/types/index.ts` (Shift, Caregiver, Family, ShiftStatus, RiskLevel).
- `src/config/`: `routes.ts`, `constants.ts`, `status.ts`, `theme.ts`.
- `src/content/copy.ts`, `src/data/{caregivers,families,shifts}.ts`.
- `src/test/setup.ts`, scripts npm (`test`, `test:ui`, `test:coverage`).
- `App.tsx` + `router.tsx` con las 8 rutas y un `PageShell` mínimo.

Entregable: navegación vacía funcionando + datos mock cargados.

---

## MVP 1 — Lógica de negocio pura + tests (≈3 min)

Objetivo: cerrar `src/lib` con tests, que es lo más barato y de mayor valor.

- `lib/eta.ts` (formato ETA, cálculo de retraso vs `DELAY_THRESHOLD_MINUTES`).
- `lib/risk.ts` (low/medium/high según retraso).
- `lib/replacements.ts` (ranking por ETA + distancia + reliability).
- `lib/format.ts` (helpers de display).
- Tests: `eta.test.ts`, `risk.test.ts`, `replacements.test.ts`.

Entregable: 3 suites de tests pasando. La narrativa del producto ya tiene cerebro.

---

## MVP 2 — Flujo del Caregiver (≈4 min)

El camino feliz principal, end-to-end del cuidador.

- Componentes: `StatusBadge`, `ShiftCard`, `ETAWidget`, `MapPlaceholder`.
- Páginas: `CaregiverDashboard` (turno de hoy + Start Trip) →
  `TripTracking` (ETA, distancia, mapa placeholder, Simulate Delay, Check In) →
  `CheckIn` (llega, confirma dirección, status → shift_started).
- Estado del turno compartido vía Context (`currentShift`).
- Toast en eventos (trip started, check-in).
- Test: `CaregiverDashboard.test.tsx`.

Entregable: cuidador inicia viaje, ve ETA, simula retraso, hace check-in.

---

## MVP 3 — Operations + Family + Replacement (≈5 min)

Cierra los otros dos actores y el flujo de reemplazo, reutilizando MVP 1 y 2.

- Componentes: `RiskBanner`, `ReplacementCard`, `ActorCard`, `ActionPanel`, `HandoffField`.
- `OperationsDashboard`: estado, ETA, risk level, sugerencias de reemplazo,
  Contact Family, Assign Replacement.
- `FamilyStatus`: cuidador actual, ETA, mensaje de retraso, Wait / Request Replacement.
- `ReplacementFlow`: candidato sugerido, distancia, ETA, notas, Accept/Reject.
- `Home`: 3 `ActorCard` (Caregiver / Operations / Family).
- Tests: `OperationsDashboard.test.tsx`, `FamilyStatus.test.tsx`.

Entregable: los 3 actores conectados; el reemplazo se solicita y se asigna.

---

## MVP 4 — Handoff + pulido (≈4 min)

Cierre del flujo y detalles de UX/calidad.

- `HandoffForm`: sueño, ánimo, cambios de medicación, eventos, notas → Finish.
- Test: `HandoffForm.test.tsx`.
- Estados de carga simulados, toasts restantes, accesibilidad (labels, texto no
  solo color), revisión de copy centralizado.

Entregable: flujo completo de las 9 pantallas + 7 suites de test verdes.

---

## Reglas para que entre en 20 min

1. **Un MVP = un prompt grande**, no micro-pasos. Claude genera el bloque completo.
2. **MVP 0 y 1 primero**: infra y lógica pura desbloquean todo y dan tests gratis.
3. **No tocar Non-Goals**: GPS, mapas, auth, backend, DB y notificaciones son simulados.
4. **Cortar por aquí si falta tiempo**: MVP 0→1→2 ya es una demo defendible;
   3 y 4 amplían cobertura de actores y pantallas.
