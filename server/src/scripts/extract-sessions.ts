/**
 * One-off migration: move `Curriculums.sessions[]` into the `sessions`
 * collection.
 *
 * Run with the same env the server uses:
 *
 *   npx dotenv -e .env.development.local -- tsx src/scripts/extract-sessions.ts --dry-run
 *   npx dotenv -e .env.development.local -- tsx src/scripts/extract-sessions.ts
 *
 * Two properties make this safe to run against live content:
 *
 *  - **Ids are preserved.** The embedded subdocuments already carried real
 *    ObjectIds, so a session keeps the exact id it had. Anything that ever
 *    points at a session id keeps pointing at the same session.
 *  - **It is idempotent and non-destructive in that order.** Sessions are
 *    written first and the embedded array is only unset once they are safely
 *    in place. Re-running skips curricula that no longer carry the array, so a
 *    half-finished run can simply be run again.
 *
 * The embedded array is read through the raw driver because the Mongoose
 * schema no longer declares it — the model would strip it before we saw it.
 */
import mongoose from "mongoose";
import { Sessions } from "../models/session-model";

const DRY_RUN = process.argv.includes("--dry-run");

interface LegacyCurriculum {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  sessions?: Record<string, unknown>[];
}

async function main(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set. Run this through dotenv, as shown in the header.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(`Connected${DRY_RUN ? " (dry run — nothing will be written)" : ""}.`);

  const raw = mongoose.connection.collection<LegacyCurriculum>("curriculums");

  // Only curricula that still carry the embedded array. Re-running is a no-op.
  const pending = await raw
    .find({ sessions: { $exists: true, $type: "array", $ne: [] } })
    .toArray();

  if (pending.length === 0) {
    console.log("Nothing to migrate — no curriculum still holds an embedded sessions array.");
    await mongoose.disconnect();
    return;
  }

  console.log(`${pending.length} curriculum(s) to migrate.`);

  let movedTotal = 0;

  for (const curriculum of pending) {
    const embedded = curriculum.sessions ?? [];
    const label = curriculum.slug || String(curriculum._id);

    // A session already extracted by a previous partial run must not be
    // inserted twice — its id is the same, so the insert would collide.
    const already = new Set(
      (
        await Sessions.find({ curriculumId: curriculum._id }).select("_id").lean()
      ).map((d) => String(d._id)),
    );

    const toInsert = embedded
      .map((session, index) => ({
        ...session,
        _id: session._id as mongoose.Types.ObjectId,
        curriculumId: curriculum._id,
        order: typeof session.order === "number" ? session.order : index,
      }))
      .filter((session) => !already.has(String(session._id)));

    console.log(
      `  ${label}: ${embedded.length} session(s), ${toInsert.length} to insert` +
        (already.size ? `, ${already.size} already present` : ""),
    );

    if (DRY_RUN) continue;

    if (toInsert.length) {
      await mongoose.connection.collection("sessions").insertMany(toInsert as any[], {
        ordered: true,
      });
    }

    // Verify before dropping the source. If the counts disagree, leave the
    // embedded array in place and stop — the curriculum is still readable
    // from it, and a half-migrated document is the one state worth avoiding.
    const written = await Sessions.countDocuments({ curriculumId: curriculum._id });
    if (written !== embedded.length) {
      console.error(
        `  ${label}: expected ${embedded.length} session(s) after write but found ${written}. ` +
          `Leaving the embedded array intact and stopping.`,
      );
      await mongoose.disconnect();
      process.exit(1);
    }

    await raw.updateOne({ _id: curriculum._id }, { $unset: { sessions: "" } });
    movedTotal += toInsert.length;
  }

  console.log(
    DRY_RUN
      ? "Dry run complete — nothing was written."
      : `Done. ${movedTotal} session(s) moved into the sessions collection.`,
  );

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Migration failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
