import { Request, Response, NextFunction } from "express";
import config from "../config";

export const healthCheck = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(200).json({ ok: true, message: "env: " + config.env });
};
