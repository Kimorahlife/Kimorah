import { useCurrentRole } from "./useCan";
import { hasUiAccess, isViewOnly, type Feature } from "./featurePermissions";

/**
 * The universal UI visibility rule. Renders the nav entry / page when the user
 * can view the feature (a global role always can). Edit / Delete affordances
 * are gated separately by <CanEdit> / <CanDelete>.
 *
 *   const showRolesNav = useFeatureUiAccess("roles");
 */
export function useFeatureUiAccess(feature: Feature): boolean {
  const { permissions, isGlobal } = useCurrentRole();
  return hasUiAccess(permissions, feature, isGlobal);
}

/**
 * True when the current user holds View on `feature` but neither Edit nor
 * Delete — read-only mode. A global role is never view-only.
 */
export function useIsViewOnly(feature: Feature): boolean {
  const { permissions, isGlobal } = useCurrentRole();
  return isViewOnly(permissions, feature, isGlobal);
}
