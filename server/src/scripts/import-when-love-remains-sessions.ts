import fs from "node:fs";
import mongoose from "mongoose";
import { Curriculums } from "../models/curriculum-model";
import { Sessions } from "../models/session-model";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Pass the curriculum text-file path as the first argument.");

const localized = (text = "") => ({ en: text, es: text });
const clean = (text: string) => text.trim().replace(/\n{3,}/g, "\n\n");
const lines = (text: string) => clean(text).split("\n").map((line) => line.trim()).filter(Boolean);
const itemize = (values: string[], icons = false) => values.map((title, order) => ({
  order,
  icon: icons ? ["psychology", "psychology", "spa", "heart", "volunteer", "book"][order % 6] : "",
  title: localized(title.replace(/^[-•]\s*/, "")),
  prompts: [],
}));
const group = (values: string[], heading = "") => ({
  order: 0,
  heading: localized(heading),
  intro: localized(""),
  items: itemize(values),
});
const section = (values: string[], intro = "", icons = false) => ({
  intro: localized(intro),
  groups: [{ ...group(values), items: itemize(values, icons) }],
});

const HEADINGS = [
  "Tema principal", "Bienvenida y reconexión", "Preguntas sugeridas", "Conceptos",
  "Objetivos", "Psicoeducación", "Intervención", "Procesamiento",
  "Cierre psicoeducativo", "Feedback y cierre en una nota positiva",
  "Enfoque terapéutico", "Referencia clínica",
];

const isHeading = (line: string) =>
  HEADINGS.includes(line) ||
  line === "Intervención Enfocada en" ||
  line === "Enfocada en" ||
  line === "Explicar";

const sliceBetween = (all: string[], start: string, ends: string[]): string[] => {
  const from = all.findIndex((line) => line === start || (start === "Intervención" && line === "Intervención Enfocada en"));
  if (from < 0) return [];
  const toOffset = all.slice(from + 1).findIndex((line) => ends.includes(line));
  return all.slice(from + 1, toOffset < 0 ? all.length : from + 1 + toOffset);
};

const parseSession = (block: string) => {
  const all = lines(block);
  const number = Number(all[0].replace(/\D/g, ""));
  const title = all[1];
  const topics = sliceBetween(all, "Tema principal", ["Bienvenida y reconexión"])
    .join(" ")
    .split("•")
    .map((topic) => topic.trim())
    .filter(Boolean);

  const welcome = sliceBetween(all, "Bienvenida y reconexión", ["Preguntas sugeridas"]);
  const welcomeQuestions = sliceBetween(all, "Preguntas sugeridas", ["Conceptos"]);
  const reminder = welcomeQuestions.find((line) => line.startsWith("Se recordará")) ?? "";
  const prompts = welcomeQuestions.filter((line) => line !== reminder);
  const concepts = sliceBetween(all, "Conceptos", ["Objetivos"]);
  const objectives = sliceBetween(all, "Objetivos", ["Psicoeducación"]);
  const psychoeducation = sliceBetween(all, "Psicoeducación", ["Intervención", "Intervención Enfocada en"])
    .filter((line) => line !== "Explicar");
  const intervention = sliceBetween(all, "Intervención", ["Procesamiento"])
    .filter((line) => line !== "Enfocada en");
  const processing = sliceBetween(all, "Procesamiento", ["Cierre psicoeducativo"])
    .filter((line) => line !== "Preguntas sugeridas");
  const closing = sliceBetween(all, "Cierre psicoeducativo", ["Feedback y cierre en una nota positiva"]);
  const feedback = sliceBetween(all, "Feedback y cierre en una nota positiva", ["Enfoque terapéutico"]);
  const approach = sliceBetween(all, "Enfoque terapéutico", ["Referencia clínica"]);
  const reference = sliceBetween(all, "Referencia clínica", []);

  return {
    order: number - 1,
    number,
    title: localized(title),
    mainTopic: topics.map(localized),
    presentation: {
      body: localized(welcome.join(" ")),
      prompts: prompts.map(localized),
      reminder: localized(reminder.replace(/^Se recordará que\s*/i, "")),
    },
    sections: {
      concepts: section(concepts),
      objectives: section(objectives),
      psychoeducation: section(psychoeducation, "", true),
      intervention: section(intervention, "Enfocada en:"),
      processing: section(processing, "Preguntas sugeridas:"),
    },
    closing: localized(closing.join("\n\n")),
    feedback: feedback.map(localized),
    therapeuticApproach: localized(approach.join(" ")),
    clinicalReference: localized(reference.join("\n\n")),
  };
};

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required.");
  const source = fs.readFileSync(sourcePath, "utf8");
  const blocks = source.split(/(?=SESIÓN\s+[2-7]\b)/).filter((block) => /^SESIÓN\s+[2-7]\b/.test(block.trim()));
  if (blocks.length !== 6) throw new Error(`Expected Sessions 2–7; found ${blocks.length}.`);
  const parsed = blocks.map(parseSession);

  await mongoose.connect(uri);
  const curriculum = await Curriculums.findOne({ slug: "when-love-remains" }).select("_id slug");
  if (!curriculum) throw new Error("The 'When Love Remains' curriculum was not found.");

  for (const session of parsed) {
    await Sessions.findOneAndUpdate(
      { curriculumId: curriculum._id, number: session.number },
      { $set: { ...session, curriculumId: curriculum._id } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  console.log(`Imported Sessions 2–7 into ${curriculum.slug}.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
