import mongoose from "mongoose";
import { Sessions } from "../models/session-model";

const presentation = {
  body: {
    en: "Each participant will have the opportunity to introduce themselves, sharing only what feels comfortable. This is a space where vulnerability is welcome and sharing is an invitation, not an obligation.",
    es: "Cada participante tendrá la oportunidad de presentarse, compartiendo únicamente aquello con lo que se sienta cómodo. Este es un espacio donde la vulnerabilidad es bienvenida y compartir es una invitación, no una obligación.",
  },
  prompts: [
    {
      en: "How would you like us to address you during the group?",
      es: "¿Cómo te gustaría que nos dirigiéramos a ti durante el grupo?",
    },
    {
      en: "Is there anything you want the group to know to better support you? (Optional)",
      es: "¿Hay algo que quieras que el grupo sepa para apoyarte mejor? (Opcional)",
    },
  ],
  reminder: {
    en: "Everyone has the right to say “Pass” if they prefer not to answer a question.",
    es: "Todas las personas tienen derecho a decir “Paso” si prefieren no responder una pregunta.",
  },
};

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required.");

  await mongoose.connect(uri);
  const bodyResult = await Sessions.updateMany(
    { $or: [{ "presentation.body.en": { $exists: false } }, { "presentation.body.en": "" }] },
    { $set: { "presentation.body": presentation.body } },
    { runValidators: true },
  );
  const promptsResult = await Sessions.updateMany(
    { $or: [{ "presentation.prompts": { $exists: false } }, { "presentation.prompts": { $size: 0 } }] },
    { $set: { "presentation.prompts": presentation.prompts } },
    { runValidators: true },
  );
  const reminderResult = await Sessions.updateMany(
    { $or: [{ "presentation.reminder.en": { $exists: false } }, { "presentation.reminder.en": "" }] },
    { $set: { "presentation.reminder": presentation.reminder } },
    { runValidators: true },
  );
  console.log(
    `Filled missing participant introductions: ${bodyResult.modifiedCount} bodies, ` +
      `${promptsResult.modifiedCount} question sets, ${reminderResult.modifiedCount} reminders.`,
  );
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
