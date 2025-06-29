// Pass status
export type PassStatus = "open" | "closed" | "escalated";

// Pass summary document (passes/{id})
export interface Pass {
  id: string;
  studentId: string;
  status: PassStatus;
  openedAt: number; // ms since epoch
  closedAt?: number;
  originLocationId: string;
  currentLocationId?: string;
  issuedBy: string; // staff/admin
  type?: "regular" | "restroom" | "parking";
  groupSize?: number;
  archived?: boolean;
  archivedAt?: number;
  forceClosed?: boolean;
  autoClosed?: boolean;
}

// Leg direction
export type LegDirection = "out" | "in";

// Leg document (legs/{passId}/{legId})
export interface PassLeg {
  legId: string;
  passId: string;
  studentId: string;
  locationId: string;
  actorId: string; // who performed the action
  direction: LegDirection;
  legNumber: number;
  timestamp: number; // ms since epoch
}
