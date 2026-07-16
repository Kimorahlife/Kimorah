/**
 * Single source of truth for well-known system role names.
 * Used by:
 *  - startup/boot.ts → to seed DEFAULT_ROLE_PERMISSIONS on first run
 *  - Controllers      → to assign roles to newly-created users (signup)
 *
 * All runtime permission checks should use can() from rbac-service, not these names.
 */
export const ROLE_CODE_MAP = {
  GlobalAdmin: "Global Admin",
  Admin:       "Admin",
  User:        "User",
} as const;

export type RoleKey = keyof typeof ROLE_CODE_MAP;
