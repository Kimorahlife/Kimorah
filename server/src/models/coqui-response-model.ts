import mongoose, { Schema } from "mongoose";

/**
 * Survey responses submitted through the app (distinct from the imported Tally
 * research submissions in `coqui_submissions`). `answers` is keyed by question
 * id; kept flexible so the survey can evolve without a migration.
 */
const coquiResponseSchema = new Schema(
  {
    answers: { type: Object, required: true },
    describes: { type: Object, default: {} },
    lang: { type: String, default: "en" },
    consent: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false, collection: "coqui_responses" }
);

export const CoquiResponse = mongoose.model("CoquiResponse", coquiResponseSchema);
