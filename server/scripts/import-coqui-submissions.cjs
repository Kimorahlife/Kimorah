/**
 * Importer for the "Echoes of Belonging" Coquí survey (Tally CSV export).
 *
 * Usage (from server/):
 *   node scripts/import-coqui-submissions.cjs "<path-to-export.csv>"
 *
 * Normalizes each submission into a clean, queryable shape keyed by short field
 * ids (the same ids the app survey uses) rather than full question sentences:
 *
 *   { submissionId, respondentId, submittedAt, source, answers: {...}, describes: {...} }
 *
 * Multi-selects become arrays; yes/no become "yes"/"no"; scales/ages become
 * numbers. Idempotent (replaceOne by Submission ID). CSV is NOT committed (PII).
 */
require("dotenv").config({ path: ".env.development.local" });
const fs = require("fs");
const mongoose = require("mongoose");

const csvPath = process.argv[2];
if (!csvPath) { console.error('Usage: node scripts/import-coqui-submissions.cjs "<path-to-export.csv>"'); process.exit(2); }

function parseCSV(s) {
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const rows = []; let row = [], field = "", inQ = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) { if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQ = false; } else field += c; }
    else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\r") {}
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Known multi-select option labels (options contain commas, so we match, not split).
const FEELINGS = ["Calm", "Neutral", "Curious", "Anxious", "Tense", "Sad", "Happy"];
const BODY_NOW = ["Slow or fast breathing", "Fluttering or tingling sensation in the stomach", "Temperature (warm, cool)", "Jaw tension", "Grounded feet or leg sensations"];
const BODY_DURING = ["Muscles relaxed (e.g., shoulders, jaw)", "Felt grounded or rooted", "Nostalgic", "Fluttering or tingling sensation in the stomach", "Tears or emotional release", "Heart rate increased or decreased", "Breathing slowed or deepened"];
const SOUND_FELT = ["Comforting", "Familiar", "Evocative or emotional", "Like part of home", "Spiritually significant", "Like a distant memory"];

const schema = new mongoose.Schema(
  { submissionId: { type: String, unique: true }, respondentId: String, submittedAt: Date, source: String, answers: Object, describes: Object },
  { timestamps: true, strict: false, collection: "coqui_submissions" }
);
const CoquiSubmission = mongoose.model("CoquiSubmission", schema);

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("❌ MONGO_URI not set in .env.development.local"); process.exit(1); }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.length > 2 && r.some((v) => v.trim()));

  // Locate a column by distinctive substrings (robust to punctuation/spacing).
  const col = (...needles) => header.findIndex((h) => needles.every((nd) => h.includes(nd)));
  const idx = {
    submissionId: col("Submission ID"), respondentId: col("Respondent ID"), submittedAt: col("Submitted at"),
    consentYes: col("Do you agree to take part", "(Yes"), age: col("Age?"),
    location_current: col("2. Location"), location_heard: col("3. Where did you used to hear"),
    years_lived: col("4. How long did you live"), time_since: col("5. How long has it been"),
    feel_now: col("6. How do you feel"), activation: col("7. How would you rate"),
    body_now: col("8. What do you notice"), body_now_other: col("If Other describe") /* first */,
    associate_yes: col("9. Do you associate", "(Yes)"), associate_desc: col("If yes, please describe:"),
    identity_yes: col("10. Do you feel that", "(Yes)"), identity_desc: col("If yes or not sure"),
    shift_yes: col("11. Did anything shift", "(Yes)"), shift_desc: col("If yes, describe what changed"),
    body_during: col("12. What did your body do"), body_during_other: col("If Other describe (2)"),
    images_yes: col("13. Did any images", "(Yes)"), images_desc: col("If yes, describe:"),
    sound_felt: col("14. Did the sound feel"), sound_felt_other: col("If Other describe (3)"),
    inside_yes: col("15. Do you feel this sound", "(Yes)"), inside_no: col("15. Do you feel this sound", "(No)"), inside_unsure: col("15. Do you feel this sound", "(Unsure)"),
    inside_desc: col("Please describe your experience"),
    meaning: col("16. In your own words"), wish_hear: col("17. Do you wish"),
    absence: col("18. How does the absence"), belonging: col("19. How does the exposure"),
    agree_yes: col("20. Do you agree or disagree", "(Agree)"), agree_desc: col("If you agree, how?"),
    anything_else: col("21. Anything else"),
  };

  const g = (r, i) => (i >= 0 ? (r[i] ?? "").trim() : "");
  const bool = (v) => v === "true" || /^yes/i.test(v);
  const num = (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; };
  const match = (cell, labels) => labels.filter((l) => cell.includes(l));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected. Importing ${data.length} submissions…`);

  let count = 0;
  for (const r of data) {
    const submissionId = g(r, idx.submissionId) || g(r, idx.respondentId);
    const answers = {
      consent: bool(g(r, idx.consentYes)) ? "yes" : "no",
      age: num(g(r, idx.age)),
      location_current: g(r, idx.location_current),
      location_heard: g(r, idx.location_heard),
      years_lived: num(g(r, idx.years_lived)),
      time_since: g(r, idx.time_since),
      feel_now: match(g(r, idx.feel_now), FEELINGS),
      activation: num(g(r, idx.activation)),
      body_now: match(g(r, idx.body_now), BODY_NOW),
      associate: bool(g(r, idx.associate_yes)) ? "yes" : "no",
      identity: bool(g(r, idx.identity_yes)) ? "yes" : "no",
      shift: bool(g(r, idx.shift_yes)) ? "yes" : "no",
      body_during: match(g(r, idx.body_during), BODY_DURING),
      images: bool(g(r, idx.images_yes)) ? "yes" : "no",
      sound_felt: match(g(r, idx.sound_felt), SOUND_FELT),
      inside: bool(g(r, idx.inside_yes)) ? "yes" : bool(g(r, idx.inside_no)) ? "no" : bool(g(r, idx.inside_unsure)) ? "unsure" : "",
      meaning: g(r, idx.meaning),
      wish_hear: g(r, idx.wish_hear),
      absence: g(r, idx.absence),
      belonging: g(r, idx.belonging),
      agree: bool(g(r, idx.agree_yes)) ? "agree" : "disagree",
      anything_else: g(r, idx.anything_else),
    };
    const describes = {
      body_now: g(r, idx.body_now_other), associate: g(r, idx.associate_desc), identity: g(r, idx.identity_desc),
      shift: g(r, idx.shift_desc), body_during: g(r, idx.body_during_other), images: g(r, idx.images_desc),
      sound_felt: g(r, idx.sound_felt_other), inside: g(r, idx.inside_desc), agree: g(r, idx.agree_desc),
    };
    const submittedAtStr = g(r, idx.submittedAt);
    const doc = {
      submissionId,
      respondentId: g(r, idx.respondentId),
      submittedAt: submittedAtStr ? new Date(submittedAtStr.replace(" ", "T")) : undefined,
      source: "research-import",
      answers,
      describes,
    };
    await CoquiSubmission.replaceOne({ submissionId }, doc, { upsert: true });
    count++;
  }

  const total = await CoquiSubmission.countDocuments();
  console.log(`✅ Imported ${count} submissions (clean schema). Collection total: ${total}.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => { console.error("❌ Import failed:", err.message); process.exit(1); });
