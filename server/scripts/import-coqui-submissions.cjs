/**
 * Importer for the "Echoes of Belonging" Coquí survey (Tally CSV export).
 *
 * Usage (from server/):
 *   node scripts/import-coqui-submissions.cjs "<path-to-export.csv>"
 *
 * Normalizes each submission into the question-bank shape:
 *   { submissionId, respondentId, submittedAt, source, consent,
 *     answers: [ { questionId, value, describe? } ] }
 * where value holds option ids (single/multi), a number (scale/age), or text.
 * Option ids come from src/config/coqui-survey.json (single source of truth).
 * Idempotent (replaceOne by Submission ID). CSV is NOT committed (PII).
 */
require("dotenv").config({ path: ".env.development.local" });
const fs = require("fs");
const mongoose = require("mongoose");
const survey = require("../src/config/coqui-survey.json");

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

// question id -> [{id, en}] for multi-selects (to map CSV labels -> option ids)
const OPT = {};
for (const q of survey.questions) {
  if (Array.isArray(q.options)) OPT[q.id] = q.options.map((o) => ({ id: o.id, en: o.label.en }));
}
const matchIds = (cell, qid) => (OPT[qid] || []).filter((o) => String(cell).includes(o.en)).map((o) => o.id);

const schema = new mongoose.Schema(
  { submissionId: { type: String, unique: true }, respondentId: String, submittedAt: Date, source: String, consent: Boolean, answers: Array },
  { timestamps: true, strict: false, collection: "coqui_submissions" }
);
const CoquiSubmission = mongoose.model("CoquiSubmission", schema);

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("❌ MONGO_URI not set in .env.development.local"); process.exit(1); }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.length > 2 && r.some((v) => v.trim()));
  const col = (...needles) => header.findIndex((h) => needles.every((nd) => h.includes(nd)));
  const idx = {
    submissionId: col("Submission ID"), respondentId: col("Respondent ID"), submittedAt: col("Submitted at"),
    consentYes: col("Do you agree to take part", "(Yes"), age: col("Age?"),
    location_current: col("2. Location"), location_heard: col("3. Where did you used to hear"),
    years_lived: col("4. How long did you live"), time_since: col("5. How long has it been"),
    feel_now: col("6. How do you feel"), activation: col("7. How would you rate"),
    body_now: col("8. What do you notice"), body_now_other: col("If Other describe"),
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

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected. Importing ${data.length} submissions…`);

  let count = 0;
  for (const r of data) {
    const submissionId = g(r, idx.submissionId) || g(r, idx.respondentId);
    const A = [];
    const add = (questionId, value, describe) => {
      const e = { questionId, value };
      if (describe) e.describe = describe;
      A.push(e);
    };
    add("consent", bool(g(r, idx.consentYes)) ? "yes" : "no");
    add("age", num(g(r, idx.age)));
    add("location_current", g(r, idx.location_current));
    add("location_heard", g(r, idx.location_heard));
    add("years_lived", num(g(r, idx.years_lived)));
    add("time_since", g(r, idx.time_since));
    add("feel_now", matchIds(g(r, idx.feel_now), "feel_now"));
    add("activation", num(g(r, idx.activation)));
    add("body_now", matchIds(g(r, idx.body_now), "body_now"), g(r, idx.body_now_other));
    add("associate", bool(g(r, idx.associate_yes)) ? "yes" : "no", g(r, idx.associate_desc));
    add("identity", bool(g(r, idx.identity_yes)) ? "yes" : "no", g(r, idx.identity_desc));
    add("shift", bool(g(r, idx.shift_yes)) ? "yes" : "no", g(r, idx.shift_desc));
    add("body_during", matchIds(g(r, idx.body_during), "body_during"), g(r, idx.body_during_other));
    add("images", bool(g(r, idx.images_yes)) ? "yes" : "no", g(r, idx.images_desc));
    add("sound_felt", matchIds(g(r, idx.sound_felt), "sound_felt"), g(r, idx.sound_felt_other));
    add("inside", bool(g(r, idx.inside_yes)) ? "yes" : bool(g(r, idx.inside_no)) ? "no" : bool(g(r, idx.inside_unsure)) ? "unsure" : "", g(r, idx.inside_desc));
    add("meaning", g(r, idx.meaning));
    add("wish_hear", g(r, idx.wish_hear));
    add("absence", g(r, idx.absence));
    add("belonging", g(r, idx.belonging));
    add("agree", bool(g(r, idx.agree_yes)) ? "agree" : "disagree", g(r, idx.agree_desc));
    add("anything_else", g(r, idx.anything_else));

    const submittedAtStr = g(r, idx.submittedAt);
    const doc = {
      submissionId,
      respondentId: g(r, idx.respondentId),
      submittedAt: submittedAtStr ? new Date(submittedAtStr.replace(" ", "T")) : undefined,
      source: "research-import",
      consent: bool(g(r, idx.consentYes)),
      answers: A,
    };
    await CoquiSubmission.replaceOne({ submissionId }, doc, { upsert: true });
    count++;
  }

  const total = await CoquiSubmission.countDocuments();
  console.log(`✅ Imported ${count} submissions (question-bank shape). Collection total: ${total}.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => { console.error("❌ Import failed:", err.message); process.exit(1); });
