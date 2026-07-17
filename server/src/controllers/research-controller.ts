import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CoquiResponse } from "../models/coqui-response-model";
import HttpError from "../util/errors/http-error";

/** Last comma-separated segment (usually the country), trimmed. */
const country = (loc: unknown): string => {
  const parts = String(loc ?? "").split(",");
  return (parts[parts.length - 1] || "").trim();
};

interface Tally { label: string; value: number }

/** Count occurrences, return top N as % of `denom` (or raw counts if denom=0). */
const topCounts = (items: string[], denom: number, limit = 8): Tally[] => {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = String(it ?? "").trim();
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, value: denom ? Math.round((count / denom) * 100) : count }));
};

/** POST /api/research/coqui/response — store an app survey submission. */
export const submitResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { answers, describes, lang } = req.body ?? {};
    if (!answers || typeof answers !== "object") {
      return next(new HttpError("A survey response (answers) is required.", 400));
    }
    const consent = answers.consent === "yes";
    const doc = await CoquiResponse.create({ answers, describes: describes ?? {}, lang: lang ?? "en", consent, source: "app" });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err: any) {
    return next(new HttpError(`Could not save response: ${err.message}`, 500));
  }
};

/**
 * GET /api/research/coqui/aggregates — dashboard numbers from the research
 * submissions (clean `answers` shape). App-submitted responses add to the
 * participant total.
 */
export const getAggregates = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) return next(new HttpError("Database not ready", 503));

    const subs = await db.collection("coqui_submissions").find({}).toArray();
    const responsesCount = await CoquiResponse.countDocuments();
    const A = subs.map((s: any) => s.answers ?? {});
    const n = A.length;

    const activations = A.map((a) => a.activation).filter((x): x is number => typeof x === "number");
    const avgActivation = activations.length ? activations.reduce((a, b) => a + b, 0) / activations.length : 0;

    const agrees = A.map((a) => String(a.agree ?? "")).filter(Boolean);
    const agreeRate = agrees.length ? Math.round((100 * agrees.filter((x) => x === "agree").length) / agrees.length) : 0;

    const identityYes = A.filter((a) => a.identity === "yes").length;
    const countries = new Set(A.map((a) => country(a.location_current)).filter(Boolean));

    res.json({
      totalParticipants: n + responsesCount,
      researchSubmissions: n,
      surveyResponses: responsesCount,
      countriesRepresented: countries.size,
      avgActivation: Number(avgActivation.toFixed(1)),
      agreeRate,
      identityBelongingRate: n ? Math.round((100 * identityYes) / n) : 0,
      topFeelings: topCounts(A.flatMap((a) => (Array.isArray(a.feel_now) ? a.feel_now : [])), n),
      topBodyResponses: topCounts(A.flatMap((a) => (Array.isArray(a.body_during) ? a.body_during : [])), n),
      currentLocations: topCounts(A.map((a) => country(a.location_current)).filter(Boolean), n, 5),
      originalLocations: topCounts(A.map((a) => String(a.location_heard ?? "").trim()).filter(Boolean), n, 5),
      quotes: A.map((a) => String(a.meaning ?? "").trim()).filter(Boolean).slice(0, 4),
    });
  } catch (err: any) {
    return next(new HttpError(`Could not compute aggregates: ${err.message}`, 500));
  }
};
