import { useUserPermissions } from "./useCan";
import { hasUiAccess, isViewOnly, type Feature } from "./featurePermissions";

/**
 * The universal UI visibility rule. Renders the nav entry / page when the user
 * can view the feature. Edit / Delete affordances are gated separately by
 * <CanEdit> / <CanDelete>, so a user with View only lands on a read-only page
 * rather than nothing at all.
 *
 *   const showRolesNav = useFeatureUiAccess("roles");
 */
export function useFeatureUiAccess(feature: Feature): boolean {
  return hasUiAccess(useUserPermissions(), feature);
}

/**
 * True when the current user holds View on `feature` but neither Edit nor
 * Delete — i.e. read-only mode and the page should surface a read-only banner.
 */
export function useIsViewOnly(feature: Feature): boolean {
  return isViewOnly(useUserPermissions(), feature);
}
