export interface Permission {
  _id: string;
  key: string;
  label: string;
  group: string;
  action: "read" | "write" | "delete";
  featureKey: "core" | "lesson-pricing" | "scheduler" | string;
}
