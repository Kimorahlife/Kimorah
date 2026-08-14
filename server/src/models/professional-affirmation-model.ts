import mongoose, { Schema } from "mongoose";

export interface IProfessionalAffirmation {
  text: string;
  translations: { en: string; es: string };
  active: boolean;
  order: number;
}

const schema = new Schema<IProfessionalAffirmation>(
  {
    text: { type: String, required: true, unique: true, trim: true },
    translations: {
      en: { type: String, required: true, trim: true },
      es: { type: String, required: true, trim: true },
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "professional_affirmations" },
);

export const ProfessionalAffirmations = mongoose.model<IProfessionalAffirmation>(
  "ProfessionalAffirmations",
  schema,
);
