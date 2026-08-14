import mongoose from "mongoose";
import { Curriculums } from "../models/curriculum-model";
import { Sessions } from "../models/session-model";

/**
 * Preserve the prose psychoeducation that used to be hardcoded.
 *
 * The reader page carried `slug === "when-love-remains" && number >= 2 && <= 7`
 * and set those sessions' psychoeducation as paragraphs instead of icon tiles.
 * That rule is now a `layout` field an author sets per group, so the rule has
 * to be written into the data it used to describe — otherwise those sessions
 * silently revert to tiles.
 *
 * The group chosen here is the one the old code actually fed to that branch:
 * the first with more than one item, else the first. Every other group keeps
 * the schema default of "points".
 *
 * Run once per environment: `npm run backfill:psychoeducation-layout`.
 * Pass --dry-run to see what it would touch without writing.
 */
const SLUG = "when-love-remains";
const FIRST_SESSION = 2;
const LAST_SESSION = 7;

async function run(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required.");

  const dryRun = process.argv.includes("--dry-run");

  await mongoose.connect(uri);
  const curriculum = await Curriculums.findOne({ slug: SLUG }).select("_id slug");
  if (!curriculum) throw new Error(`The '${SLUG}' curriculum was not found.`);

  const sessions = await Sessions.find({
    curriculumId: curriculum._id,
    number: { $gte: FIRST_SESSION, $lte: LAST_SESSION },
  }).sort({ number: 1 });

  let changed = 0;
  let alreadySet = 0;

  for (const session of sessions) {
    const groups = session.sections?.psychoeducation?.groups ?? [];
    const target = groups.find((entry) => entry.items.length > 1) ?? groups[0];
    if (!target) {
      console.log(`Session ${session.number}: no psychoeducation groups, skipped.`);
      continue;
    }

    if (target.layout === "prose") {
      alreadySet += 1;
      continue;
    }

    console.log(
      `Session ${session.number}: "${target.heading?.en || "(no heading)"}" ` +
        `(${target.items.length} item${target.items.length === 1 ? "" : "s"}) -> prose`,
    );

    if (!dryRun) {
      target.layout = "prose";
      session.markModified("sections.psychoeducation.groups");
      await session.save();
    }
    changed += 1;
  }

  console.log(
    dryRun
      ? `Dry run: ${changed} group${changed === 1 ? "" : "s"} would be set to prose (${alreadySet} already set).`
      : `Set ${changed} group${changed === 1 ? "" : "s"} to prose (${alreadySet} already set).`,
  );
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
