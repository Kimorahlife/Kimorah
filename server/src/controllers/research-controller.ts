import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CoquiResponse } from "../models/coqui-response-model";
import HttpError from "../util/errors/http-error";
import coquiSurvey from "../config/coqui-survey.json";

const country = (loc: unknown): string => {
  const parts = String(loc ?? "").split(",");
  return (parts[parts.length - 1] || "").trim();
};

interface Tally { label: string; value: number }
const topCounts = (items: string[], denom: number, limit = 8): Tally[] => {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = String(it ?? "").trim();
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
    .map(([label, count]) => ({ label, value: denom ? Math.round((count / denom) * 100) : count }));
};

/** value of an answer entry for a questionId within a response's answers array. */
const val = (doc: any, qid: string): any => (Array.isArray(doc.answers) ? doc.answers.find((a: any) => a.questionId === qid)?.value : undefined);
const arr = (doc: any, qid: string): string[] => {
  const v = val(doc, qid);
  return Array.isArray(v) ? v : [];
};

/** GET /api/research/coqui/survey — the question bank (from DB, config fallback). */
export const getSurvey = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    let questions: any[] = coquiSurvey.questions as any[];
    if (db) {
      const docs = await db.collection("coqui_questions").find({}).sort({ order: 1 }).toArray();
      if (docs.length) {
        // normalize `questionId` back to `id` for the client
        questions = docs.map((d: any) => ({ ...d, id: d.questionId }));
      }
    }
    res.json({ surveyId: coquiSurvey.surveyId, version: coquiSurvey.version, questions });
  } catch (err: any) {
    return next(new HttpError(`Could not load survey: ${err.message}`, 500));
  }
};

/** POST /api/research/coqui/response — store an app survey submission. */
export const submitResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { answers, lang } = req.body ?? {};
    if (!Array.isArray(answers)) {
      return next(new HttpError("answers must be an array of { questionId, value }.", 400));
    }
    const consent = answers.find((a: any) => a.questionId === "consent")?.value === "yes";
    const doc = await CoquiResponse.create({ answers, lang: lang ?? "en", consent, source: "app" });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err: any) {
    return next(new HttpError(`Could not save response: ${err.message}`, 500));
  }
};

/** GET /api/research/coqui/aggregates — dashboard numbers from the submissions. */
export const getAggregates = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) return next(new HttpError("Database not ready", 503));

    const subs = await db.collection("coqui_submissions").find({}).toArray();
    const responsesCount = await CoquiResponse.countDocuments();
    const n = subs.length;

    // Resolve option ids -> labels from the question bank (DB is the source of truth)
    const qdocs = await db.collection("coqui_questions").find({}).toArray();
    const optionLabel: Record<string, Record<string, string>> = {};
    for (const q of qdocs as any[]) {
      if (Array.isArray(q.options)) {
        optionLabel[q.questionId] = {};
        for (const o of q.options) optionLabel[q.questionId][o.id] = o.label?.en ?? o.id;
      }
    }
    const labelOf = (qid: string, oid: string): string => optionLabel[qid]?.[oid] ?? oid;

    const activations = subs.map((s) => val(s, "activation")).filter((x): x is number => typeof x === "number");
    const avgActivation = activations.length ? activations.reduce((a, b) => a + b, 0) / activations.length : 0;

    const agrees = subs.map((s) => String(val(s, "agree") ?? "")).filter(Boolean);
    const agreeRate = agrees.length ? Math.round((100 * agrees.filter((x) => x === "agree").length) / agrees.length) : 0;

    const identityYes = subs.filter((s) => val(s, "identity") === "yes").length;
    const countries = new Set(subs.map((s) => country(val(s, "location_current"))).filter(Boolean));

    res.json({
      totalParticipants: n + responsesCount,
      researchSubmissions: n,
      surveyResponses: responsesCount,
      countriesRepresented: countries.size,
      avgActivation: Number(avgActivation.toFixed(1)),
      agreeRate,
      identityBelongingRate: n ? Math.round((100 * identityYes) / n) : 0,
      topFeelings: topCounts(subs.flatMap((s) => arr(s, "feel_now").map((id) => labelOf("feel_now", id))), n),
      topBodyResponses: topCounts(subs.flatMap((s) => arr(s, "body_during").map((id) => labelOf("body_during", id))), n),
      currentLocations: topCounts(subs.map((s) => country(val(s, "location_current"))).filter(Boolean), n, 5),
      originalLocations: topCounts(subs.map((s) => String(val(s, "location_heard") ?? "").trim()).filter(Boolean), n, 5),
      quotes: subs.map((s) => String(val(s, "meaning") ?? "").trim()).filter(Boolean).slice(0, 4),
    });
  } catch (err: any) {
    return next(new HttpError(`Could not compute aggregates: ${err.message}`, 500));
  }
};
