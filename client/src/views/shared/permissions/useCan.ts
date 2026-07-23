import { useSelector } from "react-redux";
import { getRole } from "../../../store/store";
import { useUser } from "../../authentication/components/useUser";
import { canDoOn, type Action, type Feature } from "./featurePermissions";

/**
 * Returns the current user's permission key list. Empty when the user has no
 * role or the role lookup fails — callers should treat that as "no perms".
 */
export function useUserPermissions(): string[] {
  const user = useUser();
  const roleSlice = useSelector(getRole) as { list?: Array<{ name: string; permissions?: string[] }> } | undefined;
  const roles = roleSlice?.list ?? [];
  if (!user?.roles) return [];
  const role = roles.find((r) => r.name === user.roles);
  return role?.permissions ?? [];
}

/**
 * Returns true if the current user can perform `action` on `feature`.
 *
 *   const canEditRoles   = useCan("roles", "write");
 *   const canDeleteUsers = useCan("users", "delete");
 */
export function useCan(feature: Feature, action: Action): boolean {
  return canDoOn(useUserPermissions(), feature, action);
}
