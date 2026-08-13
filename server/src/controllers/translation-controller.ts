import { Request, Response, NextFunction } from "express";
import { Lang, TranslationUnavailable, translate } from "../services/translation-service";
import HttpError from "../util/errors/http-error";

/** Refuse a request large enough to be a mistake rather than a curriculum. */
const MAX_TEXTS = 400;
const MAX_CHARS = 60_000;

const LANGS: Lang[] = ["en", "es"];

/**
 * POST /api/translate  { texts: string[], to: "en" | "es" }  →  { message: string[] }
 *
 * Deliberately a plain list in, plain list out. The caller decides which of its
 * fields need translating and puts the results back where they came from — the
 * server never needs to know what a curriculum looks like, so this route does
 * not change when the curriculum shape does.
 *
 * Wrapped in `message` because the client's apiCallBegan middleware reads
 * `response.data.message` as the payload.
 */
export const translateTexts = async (req: Request, res: Response, next: NextFunction) => {
  const { texts, to } = req.body as { texts?: unknown; to?: unknown };

  if (!Array.isArray(texts) || texts.some((t) => typeof t !== "string")) {
    return next(new HttpError("Send { texts: string[] } to translate.", 400));
  }
  if (!LANGS.includes(to as Lang)) {
    return next(new HttpError(`Send a target language: to must be one of ${LANGS.join(", ")}.`, 400));
  }
  if (texts.length > MAX_TEXTS) {
    return next(new HttpError(`Too many strings at once (max ${MAX_TEXTS}).`, 400));
  }

  const total = (texts as string[]).reduce((n, t) => n + t.length, 0);
  if (total > MAX_CHARS) {
    return next(new HttpError(`Too much text at once (max ${MAX_CHARS} characters).`, 400));
  }

  try {
    const translations = await translate(texts as string[], to as Lang);
    return res.json({ message: translations });
  } catch (error: any) {
    if (error instanceof TranslationUnavailable) {
      return next(new HttpError(error.message, 503));
    }
    // The SDK surfaces auth and rate-limit failures with a status; pass it
    // through so the author sees "rate limited" rather than a blanket 500.
    const status = typeof error?.status === "number" ? error.status : 500;
    return next(new HttpError(error?.message || "Translation failed", status));
  }
};
