import { Roles as RoleModel } from "../models/roles-model";

export interface CachedRole {
  permissions: Set<string>;
  /** A global role bypasses all permission checks — it can do everything. */
  isGlobal: boolean;
}

/**
 * In-memory cache: roleName → CachedRole { permissions, bypassFeatureChecks }.
 * Never access this directly outside this module — use the exported functions.
 */
const _cache = new Map<string, CachedRole>();
const resolveRoleName = (roleName: string): string =>
  roleName === "Professional" ? "User" : roleName;

/** Returns all permissions for a role (empty Set if role not found). */
export function getPermissions(roleName: string): Set<string> {
  return _cache.get(resolveRoleName(roleName))?.permissions ?? new Set();
}

/** Returns true if the role has the exact permission. */
export function hasPermission(roleName: string, permission: string): boolean {
  return _cache.get(resolveRoleName(roleName))?.permissions.has(permission) ?? false;
}

/** Returns true if the role has ANY ONE of the listed permissions. */
export function hasAnyPermission(roleName: string, permissions: string[]): boolean {
  const entry = _cache.get(resolveRoleName(roleName));
  if (!entry) return false;
  return permissions.some((p) => entry.permissions.has(p));
}

/** Returns true if the role is global (bypasses all permission checks). */
export function isGlobalRole(roleName: string): boolean {
  return _cache.get(resolveRoleName(roleName))?.isGlobal ?? false;
}

/** Returns role names whose permission Set contains the requested permission.
 *  Returns [] for empty/whitespace/missing input (lenient — mirrors hasPermission semantics).
 *  Does NOT mutate the cache. */
export function listRoleNamesWithPermission(permission: string): string[] {
  if (typeof permission !== "string" || permission.trim() === "") return [];
  const names: string[] = [];
  for (const [roleName, entry] of _cache.entries()) {
    if (entry.permissions.has(permission)) names.push(roleName);
  }
  if (names.includes("User")) names.push("Professional");
  return names;
}

/** Returns the full cached role entry (permissions + bypassFeatureChecks), or undefined if not found. */
export function getCachedRole(roleName: string): CachedRole | undefined {
  return _cache.get(resolveRoleName(roleName));
}

/**
 * Rebuild the cache from the Roles collection. Call on boot and after role changes.
 * Throws on DB error so callers (controllers, boot) can handle or propagate the failure.
 * A silent cache-refresh failure would leave the in-memory cache stale after a write.
 */
export async function refreshCache(): Promise<void> {
  const roles = await RoleModel.find();
  _cache.clear();
  for (const role of roles) {
    _cache.set(role.name, {
      permissions: new Set(role.permissions),
      isGlobal: role.isGlobal ?? false,
    });
  }
  console.log(`✅ Permission cache refreshed (${roles.length} roles)`);
}

/**
 * For unit testing only — seed the cache without hitting the database.
 * Do NOT call this in production code.
 */
export function _seedCacheForTesting(
  entries: Record<string, string[] | { permissions: string[]; isGlobal: boolean }>
): void {
  _cache.clear();
  for (const [role, value] of Object.entries(entries)) {
    if (Array.isArray(value)) {
      _cache.set(role, { permissions: new Set(value), isGlobal: false });
    } else {
      _cache.set(role, { permissions: new Set(value.permissions), isGlobal: value.isGlobal });
    }
  }
}
