import { hasPermission, hasAnyPermission } from "./permission-cache";

/**
 * Returns true if the role has the exact permission.
 * Usage: can("Admin", "users:read")
 */
export function can(roleName: string | undefined, permission: string): boolean {
  if (!roleName) return false;
  return hasPermission(roleName, permission);
}

/**
 * Returns true if the role has ANY ONE of the listed permissions.
 * Usage: canAny("Admin", ["users:read", "roles:read"])
 */
export function canAny(roleName: string | undefined, permissions: string[]): boolean {
  if (!roleName) return false;
  return hasAnyPermission(roleName, permissions);
}
