export const ROUTES = {
  home: "/",
  caregiver: "/caregiver",
  shiftDetail: "/caregiver/shift/:shiftId",
  tracking: "/tracking",
  operations: "/operations",
  operationsShift: "/operations/shift/:shiftId",
  operationsReplacement: "/operations/shift/:shiftId/replacement",
  family: "/family",
  familyShift: "/family/shift/:shiftId",
  familyRecords: "/family/records",
  replacement: "/replacement",
  checkIn: "/checkin",
  handoff: "/handoff",
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Build the concrete path to a shift's detail screen (caregiver side). */
export function shiftDetailPath(shiftId: string): string {
  return ROUTES.shiftDetail.replace(":shiftId", shiftId);
}

/** Build the concrete path to a shift's detail screen (family side). */
export function familyShiftPath(shiftId: string): string {
  return ROUTES.familyShift.replace(":shiftId", shiftId);
}

/** Build the concrete path to a shift's operations profile. */
export function operationsShiftPath(shiftId: string): string {
  return ROUTES.operationsShift.replace(":shiftId", shiftId);
}

/** Build the concrete path to a shift's operations replacement screen. */
export function operationsReplacementPath(shiftId: string): string {
  return ROUTES.operationsReplacement.replace(":shiftId", shiftId);
}
