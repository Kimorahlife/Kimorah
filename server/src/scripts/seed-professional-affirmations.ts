import mongoose from "mongoose";
import { PROFESSIONAL_AFFIRMATIONS } from "../config/professional-affirmations";
import { ProfessionalAffirmations } from "../models/professional-affirmation-model";

async function run(): Promise<void> {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required.");
  await mongoose.connect(process.env.MONGO_URI);
  await ProfessionalAffirmations.bulkWrite(
    PROFESSIONAL_AFFIRMATIONS.map((translations, order) => ({
      updateOne: {
        filter: { text: translations.en },
        update: {
          $set: { translations },
          $setOnInsert: { text: translations.en, order, active: true },
        },
        upsert: true,
      },
    })),
  );
  console.log(`Professional affirmations seeded (${PROFESSIONAL_AFFIRMATIONS.length}).`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
