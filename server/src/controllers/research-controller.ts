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

    const subs = await db.collection("coqui_responses").find({}).toArray();
    const n = subs.length;
    const researchN = subs.filter((s) => s.source === "research-import").length;
    const appN = subs.filter((s) => s.source === "app").length;

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

    // Time since last exposure — parse free text ("3 months", "20", "11 years") to
    // years, then average + bucket for the dashboard.
    const parseYears = (s: unknown): number | null => {
      const t = String(s ?? "").toLowerCase().trim();
      const m = t.match(/[\d.]+/);
      if (!m) return null;
      const num = parseFloat(m[0]);
      if (isNaN(num)) return null;
      if (/month/.test(t)) return num / 12;
      if (/week/.test(t)) return num / 52;
      if (/day/.test(t)) return num / 365;
      return num; // years, or a bare number
    };
    const years = subs.map((s) => parseYears(val(s, "time_since"))).filter((y): y is number => y !== null);
    const avgTimeSinceYears = years.length ? years.reduce((a, b) => a + b, 0) / years.length : 0;
    const tsLabels = ["< 1 year", "1 – 3 years", "4 – 10 years", "11 – 20 years", "> 20 years"];
    const tsOf = (y: number): string => (y < 1 ? tsLabels[0] : y <= 3 ? tsLabels[1] : y <= 10 ? tsLabels[2] : y <= 20 ? tsLabels[3] : tsLabels[4]);
    const tsCount = new Map<string, number>(tsLabels.map((b) => [b, 0]));
    for (const y of years) tsCount.set(tsOf(y), (tsCount.get(tsOf(y)) ?? 0) + 1);
    const timeSinceBuckets = tsLabels.map((label) => ({ label, value: years.length ? Math.round((100 * (tsCount.get(label) ?? 0)) / years.length) : 0 }));

    // Emotional activation (0–10) → High / Moderate / Low bands for the donut.
    const actLabels = ["High (8 – 10)", "Moderate (5 – 7)", "Low (0 – 4)"];
    const actOf = (a: number): string => (a >= 8 ? actLabels[0] : a >= 5 ? actLabels[1] : actLabels[2]);
    const actCount = new Map<string, number>(actLabels.map((b) => [b, 0]));
    for (const a of activations) actCount.set(actOf(a), (actCount.get(actOf(a)) ?? 0) + 1);
    const activationBands = actLabels.map((label) => ({ label, value: activations.length ? Math.round((100 * (actCount.get(label) ?? 0)) / activations.length) : 0 }));

    // "Do you feel this sound lives inside you?" → yes / unsure / no.
    const insideVals = subs.map((s) => String(val(s, "inside") ?? "").trim()).filter(Boolean);
    const insideDefs: Array<[string, string]> = [["yes", "Yes — it lives inside me"], ["unsure", "Unsure"], ["no", "No"]];
    const insideDistribution = insideDefs.map(([k, label]) => ({ label, value: insideVals.length ? Math.round((100 * insideVals.filter((v) => v === k).length) / insideVals.length) : 0 }));

    res.json({
      totalParticipants: n,
      researchSubmissions: researchN,
      surveyResponses: appN,
      countriesRepresented: countries.size,
      avgActivation: Number(avgActivation.toFixed(1)),
      avgTimeSinceYears: Number(avgTimeSinceYears.toFixed(1)),
      timeSinceBuckets,
      activationBands,
      insideDistribution,
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
