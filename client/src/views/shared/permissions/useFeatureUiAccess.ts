import { useCurrentRole } from "./useCan";
import { hasUiAccess, hasFullUiAccess, isViewOnly, type Feature } from "./featurePermissions";

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
 * The stricter tier: Add AND (Edit OR Delete). Use for surfaces that should
 * open only to someone who can genuinely work in the feature, not merely reach
 * it — a partial grant leaves them out. A global role always passes.
 *
 *   const canOpenCurriculum = useFeatureFullAccess("curriculums");
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
