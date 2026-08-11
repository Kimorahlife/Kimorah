/**
 * Keeping `:read` grants honest.
 *
 * The Permission Matrix has three columns — Add / Edit / Delete — and no View
 * column, so a `:read` key is invisible in the role dialog and nothing there can
 * clear it. Access checks, however, treat read as satisfied by ANY key in the
 * group: `canDoOn(…, "read")` on the client and `hasGroupAccess` on the server
 * both OR across read/add/write/delete.
 *
 * Left alone, those two facts combine into a role that shows three empty
 * checkboxes for a feature while still reaching its page, with no admin action
 * able to revoke it.
 *
 * Kept as its own module (no React, no MUI) so it can be reasoned about and
 * tested on its own.
 */

export interface PermissionLike {
  key: string;
  group: string;
  action?: string;
}

/** A catalog entry's action, tolerating docs that only carry the `key`. */
export const isAction = (p: PermissionLike, action: string): boolean =>
  p.action === action || p.key.endsWith(`:${action}`);

/**
 * Returns `selected` with every group's `:read` keys brought in line with its
 * Add / Edit / Delete grants: present when the group grants at least one of
 * them, absent when it grants none.
 *
 * Run on every role save, so the matrix shows what the role actually holds and
 * roles carrying an orphaned `:read` heal the next time they are saved.
 */
export function reconcileReadKeys(selected: string[], permissions: PermissionLike[]): string[] {
  const out = new Set(selected);

  for (const group of new Set(permissions.map((p) => p.group))) {
    const inGroup = permissions.filter((p) => p.group === group);
    const readKeys = inGroup.filter((p) => isAction(p, "read")).map((p) => p.key);
    if (readKeys.length === 0) continue;

    const grantsSomething = inGroup.some((p) => !isAction(p, "read") && out.has(p.key));
    for (const key of readKeys) {
      if (grantsSomething) out.add(key);
      else out.delete(key);
    }
  }

  return Array.from(out);
}
