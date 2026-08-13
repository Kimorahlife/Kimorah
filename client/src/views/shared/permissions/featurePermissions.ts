/**
 * featurePermissions.ts
 *
 * Single source of truth on the client for mapping a feature (the unit a UI
 * surface gates on) to the underlying KNOWN_PERMISSIONS keys that grant
 * View / Add / Edit / Delete on that feature.
 *
 * Kimorah's server permission catalog (server/src/config/permissions.ts) has
 * four groups — Users, Roles, Research and Curriculums — each with
 * read/add/write/delete. Each feature row below maps 1:1 to those keys.
 *
 * Permission rule per action: the user has the action if they hold ANY key in
 * the array. The matrix's tri-state UI applies the same OR semantics.
 *
 * To add a Kimorah feature later: add a catalog entry in
 * server/src/config/permissions.ts (group + `<group>:read/add/write/delete`),
 * add the feature to the `Feature` union + a row here, and a matching row to
 * PermissionMatrix's DISPLAY_GROUPS. No other code changes — it's all data-driven.
 */

export type Feature =
  | "dashboard"
  | "professional-dashboard"
  | "users"
  | "roles"
  | "research"
  | "curriculums"
  // A professional running a curriculum with a set of people.
  | "groups"
  // Member workspace. The pages behind these are not built yet — granting one
  // reveals its sidebar entry and opens a "coming soon" placeholder. They are
  // real permissions today so roles can be composed ahead of the pages.
  | "profile"
  | "bookmarks"
  | "forum"
  | "messages"
  | "settings"
  | "help-center";

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
 * DATA access — holds any key on the feature, so the API will serve them.
 *
 * This is the server's rule, mirrored: `authorize` lets a `:read` route through
 * for a role holding any `<feature>:` permission. It is deliberately NOT what
 * decides whether a page or nav entry appears — see hasFullUiAccess for that.
 * Add on its own means "can reach the data", not "gets a page".
 */
export function hasUiAccess(userPermissions: string[], feature: Feature, isGlobal = false): boolean {
  return canDoOn(userPermissions, feature, "read", isGlobal);
}

/**
 * PAGE access — Add AND (Edit OR Delete). The rule for every nav entry, route
 * guard and feature gate in the app.
 *
 * Add is the base: it grants the data. A page only appears once the role can
 * also change something there, because a page you may open but not act on is
 * not a feature, it is a dead end. Which affordances then show is a separate
 * question, answered per button by <CanEdit> / <CanDelete> — so Delete without
 * Edit gives a page that deletes but does not edit.
 *
 * A global role bypasses all of it and reaches everything.
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
  dashboard: { read: ["dashboard:read"], add: ["dashboard:add"], write: ["dashboard:write"], delete: ["dashboard:delete"] },
  "professional-dashboard": {
    read: ["professional-dashboard:read"],
    add: ["professional-dashboard:add"],
    write: ["professional-dashboard:write"],
    delete: ["professional-dashboard:delete"],
  },
  users:{ read: ["users:read"], add: ["users:add"], write: ["users:write"], delete: ["users:delete"] },
  roles: { read: ["roles:read"], add: ["roles:add"], write: ["roles:write"], delete: ["roles:delete"] },
  research: { read: ["research:read"], add: ["research:add"], write: ["research:write"], delete: ["research:delete"] },
  curriculums: { read: ["curriculums:read"], add: ["curriculums:add"], write: ["curriculums:write"], delete: ["curriculums:delete"] },
  groups: { read: ["groups:read"], add: ["groups:add"], write: ["groups:write"], delete: ["groups:delete"] },
  profile: { read: ["profile:read"], add: ["profile:add"], write: ["profile:write"], delete: ["profile:delete"] },
  bookmarks: { read: ["bookmarks:read"], add: ["bookmarks:add"], write: ["bookmarks:write"], delete: ["bookmarks:delete"] },
  forum: { read: ["forum:read"], add: ["forum:add"], write: ["forum:write"], delete: ["forum:delete"] },
  messages: { read: ["messages:read"], add: ["messages:add"], write: ["messages:write"], delete: ["messages:delete"] },
  settings: { read: ["settings:read"], add: ["settings:add"], write: ["settings:write"], delete: ["settings:delete"] },
  "help-center": { read: ["help-center:read"], add: ["help-center:add"], write: ["help-center:write"], delete: ["help-center:delete"] },
};
