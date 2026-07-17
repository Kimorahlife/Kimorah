import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CoquiResponse } from "../models/coqui-response-model";
import HttpError from "../util/errors/http-error";

// Exact Tally CSV column headers, as stored in coqui_submissions.raw
const COL = {
  currentLocation: "2. Location (Current)",
  originLocation: "3. Where did you used to hear the Coquí frogs regularly? ",
  feelings: "6. How do you feel right now?(Check any that apply)",
  activation: "7. How would you rate your current emotional or nervous system state? (0 = very calm, 10 = very activated)",
  bodyDuring: "12. What did your body do during the sound exposure? (Check all that apply)",
  identity: "10. Do you feel that the Coquí sound is part of your identity, memory, or cultural belonging?",
  agree: `20. Do you agree or disagree with this statement: "Can hearing the Coquí frog call again help you feel better emotionally or physically if you hear it often?"`,
  meaning: "16. In your own words: What does this frog sound mean to you now?Emotionally, physically, culturally, or spiritually.",
};

const splitMulti = (s: unknown): string[] =>
  String(s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

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
    const k = it.trim();
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, value: denom ? Math.round((count / denom) * 100) : count }));
};

// Multi-select cells join options with ", " but options themselves contain
// commas — so we can't split on commas. Match against the known option labels.
const FEELINGS = ["Calm", "Neutral", "Curious", "Anxious", "Tense", "Sad", "Happy"];
const BODY_DURING = [
  "Muscles relaxed (e.g., shoulders, jaw)",
  "Felt grounded or rooted",
  "Nostalgic",
  "Fluttering or tingling sensation in the stomach",
  "Tears or emotional release",
  "Heart rate increased or decreased",
  "Breathing slowed or deepened",
];

const countLabels = (cells: string[], labels: string[], denom: number, limit = 8): Tally[] =>
  labels
    .map((label) => ({ label, count: cells.filter((c) => c.includes(label)).length }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ label, count }) => ({ label, value: denom ? Math.round((count / denom) * 100) : count }));

/** POST /api/research/coqui/response — store an app survey submission. */
export const submitResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { answers, describes, lang } = req.body ?? {};
    if (!answers || typeof answers !== "object") {
      return next(new HttpError("A survey response (answers) is required.", 400));
    }
    const consent = answers.consent === "yes";
    const doc = await CoquiResponse.create({ answers, describes: describes ?? {}, lang: lang ?? "en", consent });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (err: any) {
    return next(new HttpError(`Could not save response: ${err.message}`, 500));
  }
};

/** GET /api/research/coqui/aggregates — dashboard numbers from the research submissions. */
export const getAggregates = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    if (!db) return next(new HttpError("Database not ready", 503));

    const subs = await db.collection("coqui_submissions").find({}).toArray();
    const responsesCount = await CoquiResponse.countDocuments();
    const raws = subs.map((s: any) => s.raw ?? {});
    const n = raws.length;

    const activations = raws.map((r) => parseFloat(r[COL.activation])).filter((x) => !isNaN(x));
    const avgActivation = activations.length ? activations.reduce((a, b) => a + b, 0) / activations.length : 0;

    const agrees = raws.map((r) => String(r[COL.agree] ?? "")).filter(Boolean);
    const agreeRate = agrees.length
      ? Math.round((100 * agrees.filter((a) => /agree/i.test(a) && !/disagree/i.test(a)).length) / agrees.length)
      : 0;

    const identityYes = raws.filter((r) => /yes/i.test(String(r[COL.identity] ?? ""))).length;
    const countries = new Set(raws.map((r) => country(r[COL.currentLocation])).filter(Boolean));

    res.json({
      totalParticipants: n + responsesCount,
      researchSubmissions: n,
      surveyResponses: responsesCount,
      countriesRepresented: countries.size,
      avgActivation: Number(avgActivation.toFixed(1)),
      agreeRate,
      identityBelongingRate: n ? Math.round((100 * identityYes) / n) : 0,
      topFeelings: countLabels(raws.map((r) => String(r[COL.feelings] ?? "")), FEELINGS, n),
      topBodyResponses: countLabels(raws.map((r) => String(r[COL.bodyDuring] ?? "")), BODY_DURING, n),
      currentLocations: topCounts(raws.map((r) => country(r[COL.currentLocation])).filter(Boolean), n, 5),
      originalLocations: topCounts(raws.map((r) => String(r[COL.originLocation] ?? "").trim()).filter(Boolean), n, 5),
      quotes: raws.map((r) => String(r[COL.meaning] ?? "").trim()).filter(Boolean).slice(0, 4),
    });
  } catch (err: any) {
    return next(new HttpError(`Could not compute aggregates: ${err.message}`, 500));
  }
};
