import type { Localized } from "../views/curriculum/curriculum-types";

/** A user as the group endpoints return them — populated, name only. */
export interface ProfessionalRef {
  _id: string;
  name?: string;
  email?: string;
}

export interface GroupCurriculumRef {
  _id: string;
  slug: string;
  title: Localized;
  accent?: string;
  archived?: boolean;
}

/** A row on the groups table. */
export interface GroupSummary {
  _id: string;
  name: Localized;
  curriculumId: GroupCurriculumRef | null;
  mainProfessionalId: ProfessionalRef | null;
  coProfessionalIds: ProfessionalRef[];
  totalParticipants: number;
  sessionCount: number;
  createdAt?: string;
  /**
   * Whether the caller may reshape or delete this group — the main
   * professional or an admin. A co-professional records participants only, so
   * the list uses this to decide which rows offer a delete.
   */
  canManage?: boolean;
}

/**
 * One session inside a group.
 *
 * `removed` marks a session the curriculum no longer has. The row survives with
 * its participant count because it records an evening that actually happened —
 * see the group-session model on the server.
 */
export interface GroupSessionRow {
  sessionId: string;
  number: number | null;
  title: Localized | null;
  mainTopic: Localized[];
  participants: number;
  removed: boolean;
}

export interface GroupDetail {
  _id: string;
  name: Localized;
  notes?: Localized;
  curriculumId: string;
  curriculum: GroupCurriculumRef | null;
  mainProfessionalId: ProfessionalRef | null;
  coProfessionalIds: ProfessionalRef[];
  sessions: GroupSessionRow[];
  canManage: boolean;
  /** Non-zero only on the first open after the curriculum changed. */
  pendingChanges: { added: number; removed: number };
}

export interface FieldChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface ChangeLogEntry {
  _id: string;
  scope: "curriculum" | "group";
  action: string;
  changedByName: string;
  changes: FieldChange[];
  timestamp: string;
  sessionId?: string | null;
}

/** Groups blocking a curriculum delete, as the 409 reports them. */
export interface CurriculumUsage {
  inUse: boolean;
  groups: Array<{
    _id: string;
    name: Localized;
    mainProfessionalId: ProfessionalRef | null;
  }>;
  sessionUsage: Record<string, { groups: number; participants: number }>;
}
