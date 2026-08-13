import mongoose from "mongoose";
import { Curriculums } from "../models/curriculum-model";
import { Sessions } from "../models/session-model";

const ICONS = ["psychology", "psychology", "spa", "heart", "volunteer", "book"];

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required.");

  await mongoose.connect(uri);
  const curriculum = await Curriculums.findOne({ slug: "when-the-earth-changes" }).select("_id slug");
  if (!curriculum) throw new Error("The 'When the Earth Changes' curriculum was not found.");

  const sessions = await Sessions.find({
    curriculumId: curriculum._id,
    number: { $gte: 4, $lte: 7 },
  });

  let changed = 0;
  for (const session of sessions) {
    const groups = session.sections?.psychoeducation?.groups ?? [];
    const overview = groups.find((entry) => entry.items.length > 1) ?? groups[0];
    if (!overview) continue;

    overview.items.slice(0, 6).forEach((entry, index) => {
      entry.icon = ICONS[index];
    });
    session.markModified("sections.psychoeducation.groups");
    await session.save();
    changed += 1;
  }

  console.log(`Psychoeducation overview icons stored for ${changed} sessions.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
