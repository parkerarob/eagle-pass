import { z } from "zod";

export const passSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  status: z.enum(["open", "closed", "escalated"]),
  openedAt: z.number(),
  closedAt: z.number().optional(),
  originLocationId: z.string(),
  currentLocationId: z.string().optional(),
  issuedBy: z.string(),
  type: z.enum(["regular", "restroom", "parking"]).optional(),
  groupSize: z.number().optional(),
  archived: z.boolean().optional(),
  archivedAt: z.number().optional(),
  forceClosed: z.boolean().optional(),
  autoClosed: z.boolean().optional(),
});

export const passLegSchema = z.object({
  legId: z.string(),
  passId: z.string(),
  studentId: z.string(),
  locationId: z.string(),
  actorId: z.string(),
  direction: z.enum(["out", "in"]),
  legNumber: z.number(),
  timestamp: z.number(),
});

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().optional(),
  currentCount: z.number().optional(),
  staffIds: z.array(z.string()).optional(),
  shared: z.boolean().optional(),
  planningBlocked: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),
  timeLimitMinutes: z.number().optional(),
  periodOverrides: z.record(z.string()).optional(),
});

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["positive", "negative"]),
  studentIds: z.array(z.string()),
  permissionOverride: z.boolean().optional(),
});

export const studentScheduleSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  term: z.string(),
  periods: z.record(z.string()),
  updatedAt: z.number(),
  history: z
    .array(
      z.object({
        updatedAt: z.number(),
        changes: z.record(z.string()),
      }),
    )
    .optional(),
});

export const staffScheduleSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  term: z.string(),
  periods: z.record(z.string()),
  planningPeriods: z.array(z.string()).optional(),
  substituteFor: z.string().optional(),
  updatedAt: z.number(),
});

export type PassDoc = z.infer<typeof passSchema>;
export type PassLegDoc = z.infer<typeof passLegSchema>;
export type LocationDoc = z.infer<typeof locationSchema>;
export type GroupDoc = z.infer<typeof groupSchema>;
export type StudentScheduleDoc = z.infer<typeof studentScheduleSchema>;
export type StaffScheduleDoc = z.infer<typeof staffScheduleSchema>;

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
