import mongoose, { Schema } from "mongoose";

/**
 * Survey responses submitted through the app. `answers` is an array of
 * { questionId, value, describe? } referencing the question bank
 * (coqui_questions) by id — value holds option ids (single/multi), a number
 * (scale), or free text.
 */
const coquiResponseSchema = new Schema(
  {
    answers: { type: Array, required: true },
    lang: { type: String, default: "en" },
    consent: { type: Boolean, default: false },
    source: { type: String, default: "app" },
  },
  { timestamps: true, strict: false, collection: "coqui_responses" }
);

export const CoquiResponse = mongoose.model("CoquiResponse", coquiResponseSchema);
