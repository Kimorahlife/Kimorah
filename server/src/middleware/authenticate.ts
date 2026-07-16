import { Request, Response, NextFunction } from "express";
import { extractAndVerifyToken } from "../util/jwt/jwt";
import HttpError from "../util/errors/http-error";

/**
 * Verifies the JWT and attaches the decoded payload to req.user.
 * Use this on routes that require authentication but no specific permission check.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new HttpError("Not authorized", 401));
  }

  try {
    req.user = await extractAndVerifyToken(authorization);
    next();
  } catch {
    next(new HttpError("Unauthorized", 401));
  }
}
