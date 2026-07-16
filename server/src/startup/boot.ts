import { Permission } from "../models/permission-model";
import { Roles } from "../models/roles-model";
import { refreshCache } from "../services/permission-cache";
import { KNOWN_PERMISSIONS } from "../config/permissions";
import { ROLE_CODE_MAP } from "../config/role-codes";

const ALL_PERMISSION_KEYS = KNOWN_PERMISSIONS.map((p) => p.key);

const { GlobalAdmin, Admin, User } = ROLE_CODE_MAP;

/**
 * Fallback role permission seed used by `createRole` when an admin creates a
 * role without specifying permissions, and by seedDefaultRoles() on first boot.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  [GlobalAdmin]: ALL_PERMISSION_KEYS,
  [Admin]: ["users:read", "users:write", "roles:read"],
  [User]: [],
};

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
 * Seed the well-known system roles if they don't already exist, so a fresh
 * database has a usable Global Admin / Admin / User out of the box. Only
 * inserts missing roles — never overwrites an existing role's grants.
 */
export async function seedDefaultRoles(): Promise<void> {
  for (const [name, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const exists = await Roles.findOne({ name });
    if (!exists) {
      await Roles.create({
        name,
        permissions,
        isGlobal: name === GlobalAdmin,
        bypassFeatureChecks: name === GlobalAdmin,
      });
      console.log(`✅ Seeded default role: ${name}`);
    }
  }
}

/**
 * Boot sequence. Data is only ever additive here (upsert permissions, insert
 * missing default roles) — deploying never mutates existing role or user data.
 */
export async function boot(): Promise<void> {
  await syncPermissions();
  await seedDefaultRoles();
  await refreshCache();
}
