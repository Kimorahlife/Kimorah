/**
 * One-off importer for the "Echoes of Belonging" Coquí survey submissions.
 *
 * Usage (from the server/ directory):
 *   node scripts/import-coqui-submissions.cjs "<path-to-export.csv>"
 *
 * Reads a Tally CSV export and upserts each submission (by Submission ID) into
 * the `coqui_submissions` collection. Idempotent — re-running updates existing
 * rows rather than duplicating. Reads MONGO_URI from .env.development.local.
 *
 * NOTE: the CSV contains personal free-text responses — do NOT commit it to git.
 */
require("dotenv").config({ path: ".env.development.local" });
const fs = require("fs");
const mongoose = require("mongoose");

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/import-coqui-submissions.cjs "<path-to-export.csv>"');
  process.exit(2);
}

function parseCSV(s) {
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1); // strip BOM
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\r") { /* ignore */ }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const schema = new mongoose.Schema(
  {
    submissionId: { type: String, unique: true },
    respondentId: String,
    submittedAt: Date,
    raw: { type: Object }, // every column, keyed by its header — lossless
  },
  { timestamps: true, strict: false, collection: "coqui_submissions" }
);
const CoquiSubmission = mongoose.model("CoquiSubmission", schema);

(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("❌ MONGO_URI not set in .env.development.local"); process.exit(1); }

  const text = fs.readFileSync(csvPath, "utf8");
  const rows = parseCSV(text);
  const header = rows[0];
  const data = rows.slice(1).filter((r) => r.length > 2 && r.some((v) => v.trim()));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected. Importing ${data.length} submissions from ${header.length} columns…`);

  let upserts = 0;
  for (const r of data) {
    const raw = {};
    header.forEach((h, i) => { raw[h] = (r[i] ?? "").trim(); });
    const submissionId = raw["Submission ID"] || raw["Respondent ID"];
    const submittedAtStr = raw["Submitted at"];
    const doc = {
      submissionId,
      respondentId: raw["Respondent ID"] || "",
      submittedAt: submittedAtStr ? new Date(submittedAtStr.replace(" ", "T")) : undefined,
      raw,
    };
    await CoquiSubmission.updateOne({ submissionId }, { $set: doc }, { upsert: true });
    upserts++;
  }

  const total = await CoquiSubmission.countDocuments();
  console.log(`✅ Imported/updated ${upserts} submissions. Collection now has ${total} total.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => { console.error("❌ Import failed:", err.message); process.exit(1); });
