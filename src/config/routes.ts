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

export type RouteKey = keyof typeof ROUTES;
