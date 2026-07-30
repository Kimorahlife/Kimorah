import { useSelector } from "react-redux";
import { getRole } from "../../../store/store";
import { useUser } from "../../authentication/components/useUser";
import { canDoOn, type Action, type Feature } from "./featurePermissions";
import { resolveRoleName } from "../../../utils/roleAliases";

interface CurrentRole {
  permissions: string[];
  /** A global role can do everything, regardless of individual permissions. */
  isGlobal: boolean;
}

/**
 * Resolves the current user's role from the loaded roles list, returning its
 * permission keys and whether it's a global role. Empty / non-global when the
 * user has no role or the lookup fails.
 */
export function useCurrentRole(): CurrentRole {
  const user = useUser();
  const roleSlice = useSelector(getRole) as
    | { list?: Array<{ name: string; permissions?: string[]; isGlobal?: boolean }> }
    | undefined;
  const roles = roleSlice?.list ?? [];
  if (!user?.roles) return { permissions: [], isGlobal: false };
  const role = roles.find((r) => r.name === resolveRoleName(user.roles));
  return { permissions: role?.permissions ?? [], isGlobal: role?.isGlobal ?? false };
}

/** Current user's permission key list (empty when no role). */
export function useUserPermissions(): string[] {
  return useCurrentRole().permissions;
}

/**
 * Returns true if the current user can perform `action` on `feature`.
 * A global role always returns true.
 */
export function useCan(feature: Feature, action: Action): boolean {
  const { permissions, isGlobal } = useCurrentRole();
  return canDoOn(permissions, feature, action, isGlobal);
}
