export interface PeriodAssignment {
  periodId: string;
  locationId?: string;
  staffId?: string;
}

export interface StudentSchedule {
  id: string;
  studentId: string;
  term: string;
  periods: Record<string, string>; // period -> staffId
  updatedAt: number;
  history?: Array<{
    updatedAt: number;
    changes: Record<string, string>;
  }>;
}

export interface StaffSchedule {
  id: string;
  staffId: string;
  term: string;
  periods: Record<string, string>; // period -> locationId
  planningPeriods?: string[];
  substituteFor?: string; // staffId this teacher is substituting for
  updatedAt: number;
}
