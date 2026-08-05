import { Permission } from "../models/permission-model";
import { Roles } from "../models/roles-model";
import { refreshCache } from "../services/permission-cache";
import { KNOWN_PERMISSIONS } from "../config/permissions";
import { CoquiQuestion } from "../models/coqui-question-model";
import coquiSurvey from "../config/coqui-survey.json";

const ALL_PERMISSION_KEYS = KNOWN_PERMISSIONS.map((p) => p.key);

/**
 * Upserts every entry in KNOWN_PERMISSIONS into the Permission collection so
 * the role editor + permission cache stay in sync with code. Also prunes
 * Permission docs whose `key` no longer exists in KNOWN_PERMISSIONS.
 *
 * Safe to run on every boot: never touches role docs or user grants.
 */
export async function syncPermissions(): Promise<void> {
  await Permission.bulkWrite(
    KNOWN_PERMISSIONS.map(({ key, label, group, action }) => ({
      updateOne: {
        filter: { key },
        update: { $set: { label, group, action }, $setOnInsert: { key } },
        upsert: true,
      },
    })),
  );

  const deleted = await Permission.deleteMany({ key: { $nin: ALL_PERMISSION_KEYS } });
  if (deleted.deletedCount > 0) {
    console.log(`🗑️  Removed ${deleted.deletedCount} stale permission(s) from DB`);
  }

  console.log(`✅ Permissions synced (${KNOWN_PERMISSIONS.length} known)`);
}

/**
 * Roles are NEVER created automatically — the Roles collection is the single
 * source of truth and every role is authored in the Roles UI. Boot only reports
 * what it finds so an operator can spot a database with no way in.
 *
 * Access is driven by the `isGlobal` flag and the permission matrix, never by
 * role names, so there is nothing to seed for a role to work.
 */
export async function reportRoleState(): Promise<void> {
  const count = await Roles.estimatedDocumentCount();
  if (count === 0) {
    console.warn("⚠️  No roles exist — create one in the Roles UI and flag it global to grant admin access.");
    return;
  }
  const hasGlobal = await Roles.exists({ isGlobal: true });
  if (!hasGlobal) {
    console.warn("⚠️  No global (isGlobal) role exists — flag one role as global to grant admin access.");
  }
}

/**
 * Bootstrap the Coquí survey question bank ONLY when it's empty (e.g. a fresh
 * database). After that the `coqui_questions` collection is the single source
 * of truth — edit questions there and they persist across restarts/deploys.
 * The config JSON is just the one-time initial content, never an override.
 */
export async function seedCoquiQuestions(): Promise<void> {
  const existing = await CoquiQuestion.estimatedDocumentCount();
  if (existing > 0) {
    console.log(`✅ Coquí questions present (${existing}) — DB is source of truth, not overwriting.`);
    return;
  }
  const questions = coquiSurvey.questions as Array<Record<string, unknown>>;
  await CoquiQuestion.insertMany(
    questions.map((q) => {
      const { id, ...rest } = q as { id: string };
      return { questionId: id, ...rest };
    })
  );
  console.log(`✅ Coquí questions seeded from config (${questions.length}) — manage them in the DB from now on.`);
}

/**
 * Boot sequence. Data is only ever additive here (upsert permissions, sync
 * survey questions) — deploying never creates roles and never mutates existing
 * role, user, or response data.
 */
export async function boot(): Promise<void> {
  await syncPermissions();
  await reportRoleState();
  await seedCoquiQuestions();
  await refreshCache();
}
