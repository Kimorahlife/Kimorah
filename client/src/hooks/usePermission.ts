import { useSelector } from "react-redux";
import { getRole } from "../store/store";
import { useUser } from "../views/authentication/components/useUser";

/**
 * Returns true if the current user's role has the given permission key.
 *
 * Usage:
 *   const canEdit = usePermission("schools:write");
 */
export function usePermission(permission: string): boolean {
  const user = useUser();
  const { list: roles } = useSelector(getRole);

  if (!user?.roles) return false;

  const role = roles.find((r) => r.name === user.roles);
  if (!role) return false;

  return role.permissions.includes(permission);
}
