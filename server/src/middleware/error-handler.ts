import { Request, Response, NextFunction } from "express";
import HttpError from "../util/errors/http-error";

export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred.",
  });
};
