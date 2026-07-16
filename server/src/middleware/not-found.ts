import { Request, Response, NextFunction } from "express";
import HttpError from "../util/errors/http-error";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(new HttpError("Could not find route.", 404));
};
