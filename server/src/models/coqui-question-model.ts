import mongoose, { Schema } from "mongoose";

/**
 * The Coquí survey question bank (source of truth for the survey). Seeded on
 * boot from src/config/coqui-survey.json. Bilingual prompts/options.
 */
const coquiQuestionSchema = new Schema(
  {
    questionId: { type: String, unique: true },
    order: Number,
    type: String,
    prompt: Object,
    helper: Object,
    options: Array, // [{ id, label: { en, es } }]
    placeholder: Object,
    scaleMin: Number,
    scaleMax: Number,
    scaleMinLabel: Object,
    scaleMaxLabel: Object,
    describe: Object,
    optional: Boolean,
  },
  { timestamps: true, strict: false, collection: "coqui_questions" }
);

export const CoquiQuestion = mongoose.model("CoquiQuestion", coquiQuestionSchema);
