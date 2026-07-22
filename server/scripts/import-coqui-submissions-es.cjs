/**
 * Importer for the Spanish "Ecos de pertenencia" Coquí survey (Tally CSV export).
 *
 * Usage (from server/):
 *   node scripts/import-coqui-submissions-es.cjs "<path-to-export.csv>"
 *
 * Same target shape as the English importer (import-coqui-submissions.cjs), but:
 *   - matches the Spanish column headers,
 *   - maps the Spanish option wording (which differs from coqui-survey.json's
 *     `es` labels) to option ids via normalized substring patterns,
 *   - tags every record `lang: "es"`.
 * Idempotent (replaceOne by Submission ID). CSV is NOT committed (PII).
 */
require("dotenv").config({ path: ".env.development.local" });
const fs = require("fs");
const mongoose = require("mongoose");

const csvPath = process.argv[2];
if (!csvPath) { console.error('Usage: node scripts/import-coqui-submissions-es.cjs "<path-to-export.csv>"'); process.exit(2); }

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

// lowercase + strip accents, for resilient substring matching
const norm = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Multi-select option matchers: id -> distinctive normalized substrings.
// A cell "selects" an option if it contains any of that option's patterns.
const MULTI = {
  feel_now: {
    calm: ["tranquilo"], neutral: ["neutral"], curious: ["curioso"],
    anxious: ["ansioso"], tense: ["tenso"], sad: ["triste"], happy: ["feliz"],
    excited: ["emocionado"], // not in the taxonomy; kept so it isn't silently dropped
  },
  body_now: {
    breathing: ["respiracion"], flutter: ["aleteo", "hormigueo"], temperature: ["temperatura"],
    jaw: ["mandibula"], grounded: ["pies conectados", "arraig", "piernas"], stomach: ["dolor de estomago"],
  },
  body_during: {
    relaxed: ["musculos relajados"], grounded: ["arraig", "pies en la tierra"], nostalgic: ["nostalgico"],
    tears: ["lagrimas"], flutter: ["aleteo", "hormigueo"], heart: ["cardiaco"], breathing: ["respiracion"],
  },
  sound_felt: {
    comforting: ["reconfortante"], spiritual: ["espiritualmente"], familiar: ["familiar"],
    home: ["parte del hogar"], evocative: ["evocador"], distant: ["recuerdo lejano"],
  },
};
// Questions that have an "other" bucket for anything not otherwise matched.
const HAS_OTHER = new Set(["body_now", "body_during", "sound_felt"]);

function matchIds(cell, qid) {
  const c = norm(cell);
  if (!c.trim()) return [];
  const ids = [];
  for (const [id, pats] of Object.entries(MULTI[qid] || {})) {
    if (pats.some((p) => c.includes(p))) ids.push(id);
  }
  if (/\botro\b/.test(c) && HAS_OTHER.has(qid) && !ids.includes("other")) ids.push("other");
  // Non-empty answer that matched nothing → bucket as "other" where available.
  if (!ids.length && HAS_OTHER.has(qid)) ids.push("other");
  return ids;
}

const schema = new mongoose.Schema(
  { submissionId: { type: String, unique: true, sparse: true }, respondentId: String, submittedAt: Date, source: String, lang: String, consent: Boolean, answers: Array },
  { timestamps: true, strict: false, collection: "coqui_responses" }
);
const CoquiSubmission = mongoose.model("CoquiSubmissionEs", schema);

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("❌ MONGO_URI not set in .env.development.local"); process.exit(1); }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.length > 2 && r.some((v) => v.trim()));

  // col(includes[], excludes[]) — first header containing all `inc` and none of `exc`.
  const col = (inc, exc = []) => header.findIndex((h) => inc.every((nd) => h.includes(nd)) && exc.every((nd) => !h.includes(nd)));
  const idx = {
    submissionId: col(["Submission ID"]), respondentId: col(["Respondent ID"]), submittedAt: col(["Submitted at"]),
    consentYes: col(["¿Acepta participar", "(Sí"]), age: col(["Edad?"]),
    location_current: col(["2. Ubicación"]), location_heard: col(["3. ¿Dónde sol"]),
    years_lived: col(["4. ¿Cuánto tiempo viviste"]), time_since: col(["5. ¿Cuánto tiempo ha pasado"]),
    feel_now: col(["6. ¿Cómo te sientes"]), activation: col(["7. ¿Cómo calific"]),
    body_now: col(["8. ¿Qué notas"]), body_now_other: col(["Si otros describe"], ["(2)", "(3)"]),
    associate_yes: col(["9. ¿Asocias", "(Si)"]), associate_desc: col(["describa:"], ["(2)", "como"]),
    identity_yes: col(["10. ¿Sientes que el sonido", "(Si)"]), identity_desc: col(["describa como"]),
    shift_yes: col(["11. ¿Algo cambió", "(Si)"]), shift_desc: col(["describa lo que cambió"]),
    body_during: col(["12. ¿Qué hizo"]), body_during_other: col(["Si otros describe (2)"]),
    images_yes: col(["13. ¿Surgieron", "(Si)"]), images_desc: col(["describa: (2)"]),
    sound_felt: col(["14. ¿Como se sent"]), sound_felt_other: col(["Si otros describe (3)"]),
    inside_yes: col(["15. ¿Sientes que este sonido", "(Si)"]), inside_no: col(["15. ¿Sientes que este sonido", "(No)"]), inside_unsure: col(["15. ¿Sientes que este sonido", "(Inseguro"]),
    inside_desc: col(["Describe tu experiencia"]),
    meaning: col(["16. En tus propias palabras"]), wish_hear: col(["17. ¿Desearías"]),
    absence: col(["18. ¿Cómo la ausencia"]), belonging: col(["19. ¿Cómo contribuye"]),
    agree_yes: col(["20. ¿Está de acuerdo", "(Acuerdo)"]), agree_desc: col(["Si estás de acuerdo"]),
    anything_else: col(["21. ¿Algo más"]),
  };
  const g = (r, i) => (i >= 0 ? (r[i] ?? "").trim() : "");
  const bool = (v) => v === "true" || /^s[ií]/i.test(v) || /^yes/i.test(v);
  const num = (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; };

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected. Importing ${data.length} Spanish submissions…`);

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
      lang: "es",
      consent: bool(g(r, idx.consentYes)),
      answers: A,
    };
    await CoquiSubmission.replaceOne({ submissionId }, doc, { upsert: true });
    count++;
  }

  const total = await CoquiSubmission.countDocuments();
  const esTotal = await CoquiSubmission.countDocuments({ lang: "es" });
  console.log(`✅ Imported ${count} Spanish submissions. Collection total: ${total} (es: ${esTotal}).`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => { console.error("❌ Import failed:", err.message); process.exit(1); });
