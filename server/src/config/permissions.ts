/**
 * KNOWN_PERMISSIONS — single source of truth for all permissions in the system.
 *
 * Adding a new feature:
 *   1. Add read, add, write, and delete entries for the new group here.
 *   2. On next server boot, syncPermissions() upserts them into the DB automatically.
 *   3. No manual seeding or DB changes needed.
 *
 * Groups map to navigation sections so the UI can render them as rows in a matrix.
 * Actions (read / add / write / delete) map to columns: View | Add | Edit | Delete.
 */
export interface KnownPermission {
  key: string;
  label: string;
  group: string;
  action: "read" | "add" | "write" | "delete";
}

export const KNOWN_PERMISSIONS: KnownPermission[] = [
  // Users
  { key: "users:read",   label: "Users – View",   group: "Users", action: "read"   },
  { key: "users:add",    label: "Users – Add",    group: "Users", action: "add"    },
  { key: "users:write",  label: "Users – Edit",   group: "Users", action: "write"  },
  { key: "users:delete", label: "Users – Delete", group: "Users", action: "delete" },

  // Roles
  { key: "roles:read",   label: "Roles – View",   group: "Roles", action: "read"   },
  { key: "roles:add",    label: "Roles – Add",    group: "Roles", action: "add"    },
  { key: "roles:write",  label: "Roles – Edit",   group: "Roles", action: "write"  },
  { key: "roles:delete", label: "Roles – Delete", group: "Roles", action: "delete" },

  // Research (Coquí survey questions)
  { key: "research:read",   label: "Research – View",   group: "Research", action: "read"   },
  { key: "research:add",    label: "Research – Add",    group: "Research", action: "add"    },
  { key: "research:write",  label: "Research – Edit",   group: "Research", action: "write"  },
  { key: "research:delete", label: "Research – Delete", group: "Research", action: "delete" },
];
