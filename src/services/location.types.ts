export interface Location {
  id: string;
  name: string;
  capacity?: number;
  currentCount?: number;
  staffIds?: string[];
  shared?: boolean;
  planningBlocked?: boolean;
  requiresApproval?: boolean;
  timeLimitMinutes?: number;
}
