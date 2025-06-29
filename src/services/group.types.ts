export type GroupType = "positive" | "negative";

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  studentIds: string[];
  permissionOverride?: boolean;
}
