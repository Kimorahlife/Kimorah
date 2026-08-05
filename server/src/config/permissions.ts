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
  // Dashboards. Each dashboard is its own group so a role can be granted any
  // combination of them — a user may hold several and switch between them.
  { key: "dashboard:read",   label: "Dashboard – View",   group: "Dashboard", action: "read"   },
  { key: "dashboard:add",    label: "Dashboard – Add",    group: "Dashboard", action: "add"    },
  { key: "dashboard:write",  label: "Dashboard – Edit",   group: "Dashboard", action: "write"  },
  { key: "dashboard:delete", label: "Dashboard – Delete", group: "Dashboard", action: "delete" },

  { key: "professional-dashboard:read",   label: "Professional Dashboard – View",   group: "Professional Dashboard", action: "read"   },
  { key: "professional-dashboard:add",    label: "Professional Dashboard – Add",    group: "Professional Dashboard", action: "add"    },
  { key: "professional-dashboard:write",  label: "Professional Dashboard – Edit",   group: "Professional Dashboard", action: "write"  },
  { key: "professional-dashboard:delete", label: "Professional Dashboard – Delete", group: "Professional Dashboard", action: "delete" },

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

  // Curriculums (Mission session curricula)
  { key: "curriculums:read",   label: "Curriculums – View",   group: "Curriculums", action: "read"   },
  { key: "curriculums:add",    label: "Curriculums – Add",    group: "Curriculums", action: "add"    },
  { key: "curriculums:write",  label: "Curriculums – Edit",   group: "Curriculums", action: "write"  },
  { key: "curriculums:delete", label: "Curriculums – Delete", group: "Curriculums", action: "delete" },
];
