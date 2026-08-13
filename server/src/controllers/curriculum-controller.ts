import { Request, Response, NextFunction } from "express";
import { Curriculums, ICurriculum, SECTION_KEYS } from "../models/curriculum-model";
import HttpError from "../util/errors/http-error";

type CurriculumBody = Partial<Omit<ICurriculum, "_id">>;

/** Fields an author may set. Anything else in the body is ignored. */
const WRITABLE = [
  "number",
  "slug",
  "title",
  "highlightedTitle",
  "description",
  "author",
  "accent",
  "published",
  "order",
  "sessions",
] as const;

/** Derive a URL-safe slug from a title when the author has not supplied one. */
const slugify = (s: string): string =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const emptyLocalized = () => ({ en: "", es: "" });

/**
 * Fill in anything the client omitted, so a session always round-trips with
 * every section key present and every section shaped `{ intro, groups }`.
 * Without this, a session saved before a section existed would come back
 * missing it and break the editor's `.map`.
 *
 * Also accepts a bare array for a section — the shape this model used before
 * grouped sections — and lifts it into a single unnamed group, so an early
 * document is not stranded.
 */
const normalizeSection = (raw: any): any => {
  if (Array.isArray(raw)) {
    return { intro: emptyLocalized(), groups: raw.length ? [{ order: 0, items: raw }] : [] };
  }
  return {
    intro: raw?.intro ?? emptyLocalized(),
    groups: Array.isArray(raw?.groups)
      ? raw.groups.map((g: any, i: number) => ({
          ...g,
          order: typeof g?.order === "number" ? g.order : i,
          items: Array.isArray(g?.items) ? g.items : [],
        }))
      : [],
  };
};

const normalizeSessions = (sessions: any): any =>
  Array.isArray(sessions)
    ? sessions.map((s, i) => ({
        ...s,
        order: typeof s?.order === "number" ? s.order : i,
        mainTopic: Array.isArray(s?.mainTopic) ? s.mainTopic : [],
        feedback: Array.isArray(s?.feedback) ? s.feedback : [],
        presentation: {
          body: s?.presentation?.body ?? emptyLocalized(),
          prompts: Array.isArray(s?.presentation?.prompts) ? s.presentation.prompts : [],
          reminder: s?.presentation?.reminder ?? emptyLocalized(),
        },
        sections: Object.fromEntries(
          SECTION_KEYS.map((k) => [k, normalizeSection(s?.sections?.[k])]),
        ),
      }))
    : [];

const pickWritable = (body: CurriculumBody): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  if (out.sessions !== undefined) out.sessions = normalizeSessions(out.sessions);
  return out;
};

/** GET /api/curriculums/all — every curriculum, authoring order. */
export const getAllCurriculums = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const list = await Curriculums.find().sort({ order: 1, number: 1 });
    res.json({ message: list });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculums", 500));
  }
};

/**
 * GET /api/curriculums/public — no authentication.
 *
 * What the public Mission page renders its cards from. Published only, and
 * without `sessions`: the card needs a title and a description, and shipping
 * every session's prose to an anonymous visitor would be both wasteful and a
 * way to read an unfinished curriculum through a page that never shows it.
 */
export const getPublicCurriculums = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const list = await Curriculums.find({ published: true })
      .select("number slug title highlightedTitle description author accent order")
      .sort({ order: 1, number: 1 });
    res.json({ message: list });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculums", 500));
  }
};

/**
 * GET /api/curriculums/public/:slug — no authentication.
 *
 * One published curriculum, sessions and all. This is what the session pages
 * render from, so unlike the card list it must carry the whole document.
 */
export const getPublicCurriculumBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findOne({ slug: req.params.slug, published: true });
    if (!doc) return next(new HttpError("Curriculum not found", 404));
    res.json({ message: doc });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculum", 500));
  }
};

/** GET /api/curriculums/:id */
export const getCurriculumById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findById(req.params.id);
    if (!doc) return next(new HttpError("Curriculum not found", 404));
    res.json({ message: doc });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to load curriculum", 500));
  }
};

/** POST /api/curriculums/create */
export const createCurriculum = async (
  req: Request<{}, {}, CurriculumBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const body = pickWritable(req.body ?? {});
  const title = (req.body?.title as any)?.en || (req.body?.title as any)?.es || "";
  const slug = String(body.slug || slugify(title)).trim();

  if (!slug) {
    return next(new HttpError("A curriculum needs a title or a slug.", 400));
  }

  try {
    const doc = await Curriculums.create({ ...body, slug });
    res.status(201).json({ message: doc });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new HttpError(`A curriculum with the slug '${slug}' already exists.`, 400));
    }
    return next(new HttpError(error.message || "Failed to create curriculum", 500));
  }
};

/** PUT /api/curriculums/:id — the editor saves the whole document. */
export const updateCurriculum = async (
  req: Request<{ id: string }, {}, CurriculumBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findById(req.params.id);
    if (!doc) return next(new HttpError("Curriculum not found", 404));

    doc.set(pickWritable(req.body ?? {}));
    await doc.save();
    res.json({ message: doc });
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return next(new HttpError("Another curriculum already uses that slug.", 400));
    }
    return next(new HttpError(error.message || "Failed to update curriculum", 500));
  }
};

/** DELETE /api/curriculums/:id */
export const deleteCurriculum = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const doc = await Curriculums.findByIdAndDelete(req.params.id);
    if (!doc) return next(new HttpError("Curriculum not found", 404));
    res.json({ message: doc });
  } catch (error: any) {
    return next(new HttpError(error.message || "Failed to delete curriculum", 500));
  }
};
