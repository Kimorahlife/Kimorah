import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ProfessionalAffirmations } from "../models/professional-affirmation-model";
import HttpError from "../util/errors/http-error";

/** Return one random active affirmation, excluding the browser's last result. */
export async function getRandomProfessionalAffirmation(
  req: Request<{}, {}, {}, { exclude?: string; lang?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const match: Record<string, unknown> = { active: true };
    if (req.query.exclude && mongoose.isValidObjectId(req.query.exclude)) {
      match._id = { $ne: new mongoose.Types.ObjectId(req.query.exclude) };
    }
    const [affirmation] = await ProfessionalAffirmations.aggregate([
      { $match: match },
      { $sample: { size: 1 } },
      { $project: { translations: 1 } },
    ]);
    if (!affirmation) return next(new HttpError("No professional affirmations are available.", 404));
    const lang = req.query.lang === "es" ? "es" : "en";
    res.json({ message: { _id: affirmation._id, text: affirmation.translations?.[lang] || affirmation.translations?.en } });
  } catch (error: any) {
    next(new HttpError(error.message || "Failed to load a professional affirmation.", 500));
  }
}
