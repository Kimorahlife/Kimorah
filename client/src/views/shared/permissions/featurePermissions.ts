/**
 * featurePermissions.ts
 *
 * Single source of truth on the client for mapping a feature (the unit a UI
 * surface gates on) to the underlying KNOWN_PERMISSIONS keys that grant
 * View / Add / Edit / Delete on that feature.
 *
 * Kimorah's server permission catalog (server/src/config/permissions.ts) has
 * exactly two groups — Users and Roles — each with read/add/write/delete. Each
 * feature row below maps 1:1 to those keys.
 *
 * Permission rule per action: the user has the action if they hold ANY key in
 * the array. The matrix's tri-state UI applies the same OR semantics.
 *
 * To add a Kimorah feature later (e.g. research/Coquí): add a catalog entry in
 * server/src/config/permissions.ts (group + `<group>:read/add/write/delete`),
 * add the feature to the `Feature` union + a row here, and a matching row to
 * PermissionMatrix's DISPLAY_GROUPS. No other code changes — it's all data-driven.
 */

export type Feature = "users" | "roles" | "research";

export type Action = "read" | "add" | "write" | "delete";

export type FeaturePerms = Record<Action, string[]>;

/**
 * Pure check: does `userPermissions` grant `action` on `feature`? Holds true
 * when the user owns ANY of the mapped keys. Used by hooks AND by non-React
 * call sites.
 */
export function canDoOn(userPermissions: string[], feature: Feature, action: Action, isGlobal = false): boolean {
  if (isGlobal) return true; // a global role can do everything
  if (userPermissions.length === 0) return false;
  if (action === "read") {
    // The View column was removed from the Permission Matrix, so any granted
    // action on the feature (add / write / delete) now implies read. Keeps
    // every existing `useCan(X, "read")` / `useFeatureUiAccess(X)` call site
    // working, and matches the server's `hasGroupAccess` behaviour.
    const fp = FEATURE_PERMISSIONS[feature];
    return [...fp.read, ...fp.add, ...fp.write, ...fp.delete].some((p) =>
      userPermissions.includes(p),
    );
  }
  const required = FEATURE_PERMISSIONS[feature][action];
  if (required.length === 0) return false;
  return required.some((p) => userPermissions.includes(p));
}

/**
 * Page-level access. A user has UI access to a feature if they hold ANY of its
 * add/write/delete keys (the "View" column was removed). Granting only Add OR
 * only Edit OR only Delete surfaces the page; individual buttons gate via
 * <CanAdd> / <CanEdit> / <CanDelete>.
 */
export function hasUiAccess(userPermissions: string[], feature: Feature, isGlobal = false): boolean {
  return canDoOn(userPermissions, feature, "add", isGlobal);
}

/**
 * "Full" UI access — Add + (Edit OR Delete): the user can DO something beyond
 * reading. Used for nav visibility decisions.
 */
export function hasFullUiAccess(userPermissions: string[], feature: Feature, isGlobal = false): boolean {
  if (isGlobal) return true;
  return (
    canDoOn(userPermissions, feature, "add") &&
    (canDoOn(userPermissions, feature, "write") ||
      canDoOn(userPermissions, feature, "delete"))
  );
}

/**
 * True when the user can land on the page but holds NO add/write/delete — i.e.
 * they're in "view-only" mode (legacy `:read` grant only). Useful for a
 * read-only banner on top of a list / detail page.
 */
export function isViewOnly(userPermissions: string[], feature: Feature, isGlobal = false): boolean {
  if (isGlobal) return false; // global can do everything, never view-only
  if (!hasUiAccess(userPermissions, feature)) return false;
  return (
    !canDoOn(userPermissions, feature, "add") &&
    !canDoOn(userPermissions, feature, "write") &&
    !canDoOn(userPermissions, feature, "delete")
  );
}

export const FEATURE_PERMISSIONS: Record<Feature, FeaturePerms> = {
  users: { read: ["users:read"], add: ["users:add"], write: ["users:write"], delete: ["users:delete"] },
  roles: { read: ["roles:read"], add: ["roles:add"], write: ["roles:write"], delete: ["roles:delete"] },
  research: { read: ["research:read"], add: ["research:add"], write: ["research:write"], delete: ["research:delete"] },
};
