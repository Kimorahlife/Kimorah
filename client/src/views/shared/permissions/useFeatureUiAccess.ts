import { useCurrentRole } from "./useCan";
import { hasUiAccess, hasFullUiAccess, isViewOnly, type Feature } from "./featurePermissions";

/**
 * DATA access — the role holds any key on the feature, so the API will serve
 * it. This is NOT the rule for showing a page: reach for useFeatureFullAccess.
 *
 * Kept because it mirrors the server's `:read` behaviour, and because
 * isViewOnly is defined in terms of it.
 */
export function useFeatureUiAccess(feature: Feature): boolean {
  const { permissions, isGlobal } = useCurrentRole();
  return hasUiAccess(permissions, feature, isGlobal);
}

/**
 * PAGE access — Add AND (Edit OR Delete). The rule for every nav entry, route
 * guard and feature gate in the app.
 *
 * Add grants the data; a page appears only once the role can also change
 * something there. A global role always passes.
 *
 *   const showRolesNav = useFeatureFullAccess("roles");
 */
export function useFeatureFullAccess(feature: Feature): boolean {
  const { permissions, isGlobal } = useCurrentRole();
  return hasFullUiAccess(permissions, feature, isGlobal);
}

/**
 * True when the current user holds View on `feature` but neither Edit nor
 * Delete — read-only mode. A global role is never view-only.
 */
export function useIsViewOnly(feature: Feature): boolean {
  const { permissions, isGlobal } = useCurrentRole();
  return isViewOnly(permissions, feature, isGlobal);
}
