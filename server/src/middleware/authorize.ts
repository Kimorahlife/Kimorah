import { Request, Response, NextFunction } from "express";
import HttpError from "../util/errors/http-error";
import { extractAndVerifyToken } from "../util/jwt/jwt";
import { hasPermission, hasAnyPermission, getCachedRole, isGlobalRole } from "../services/permission-cache";

/**
 * Group-prefix permission match. Used for :read requirements only —
 * if the cached role holds ANY perm starting with the same group
 * (e.g. role has "users:write"; requirement is "users:read"), accept.
 */
function hasGroupAccess(roleName: string, permission: string): boolean {
  if (hasPermission(roleName, permission)) return true;
  const group = permission.split(":")[0];
  const cached = getCachedRole(roleName);
  if (!cached) return false;
  for (const p of cached.permissions) {
    if (p.startsWith(`${group}:`)) return true;
  }
  return false;
}

/**
 * Middleware factory — requires the user's role to have the given permission.
 * Usage: router.get("/all", authorize("users:read"), getAllUsers)
 */
export function authorize(permission: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new HttpError("Not authorized", 401));
    }

    try {
      const decoded = await extractAndVerifyToken(authorization);
      req.user = decoded;
      const roleName = decoded.roles;

      if (!roleName) {
        return next(new HttpError("No role assigned to this user", 403));
      }

      // A global role can do everything — no per-permission check.
      if (isGlobalRole(roleName)) return next();

      // For :read requirements, accept any granted permission in the same group
      // (e.g. `users:write` satisfies a route guarded by `users:read`).
      // Non-read perms keep their strict check.
      const permGranted = permission.endsWith(":read")
        ? hasGroupAccess(roleName, permission)
        : hasPermission(roleName, permission);

      if (!permGranted) {
        return next(new HttpError("You do not have permission to perform this action", 403));
      }

      next();
    } catch {
      return next(new HttpError("Unauthorized", 401));
    }
  };
}

/**
 * Middleware factory — requires ANY ONE of the listed permissions.
 * Usage: router.get("/x", authorizeAny(["users:read", "roles:read"]), handler)
 */
export function authorizeAny(permissions: string[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new HttpError("Not authorized", 401));
    }

    try {
      const decoded = await extractAndVerifyToken(authorization);
      req.user = decoded;
      const roleName = decoded.roles;

      if (!roleName) {
        return next(new HttpError("No role assigned to this user", 403));
      }

      // A global role can do everything — no per-permission check.
      if (isGlobalRole(roleName)) return next();

      if (!hasAnyPermission(roleName, permissions)) {
        return next(new HttpError("You do not have permission to perform this action", 403));
      }

      next();
    } catch {
      return next(new HttpError("Unauthorized", 401));
    }
  };
}
