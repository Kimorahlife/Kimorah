/**
 * wrappers.tsx
 *
 * React wrappers around the permission hooks. Use these instead of inlining
 * permission checks throughout the codebase — the wrapper makes intent obvious
 * in the JSX and keeps the gate uniform.
 *
 *   <CanAdd feature="roles"><NewRoleButton /></CanAdd>
 *   <CanEdit feature="roles"><EditRoleButton /></CanEdit>
 *   <CanDelete feature="roles"><DeleteIconButton /></CanDelete>
 *   <FeatureUiGate feature="roles"><RolesPage /></FeatureUiGate>
 *   <ReadOnlyBanner feature="roles" />
 */
import { ReactNode } from "react";
import { Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCan } from "./useCan";
import { useFeatureUiAccess, useIsViewOnly } from "./useFeatureUiAccess";
import type { Feature } from "./featurePermissions";

interface GateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
}

export const CanView: React.FC<GateProps> = ({ feature, children, fallback = null }) => {
  return useCan(feature, "read") ? <>{children}</> : <>{fallback}</>;
};

export const CanAdd: React.FC<GateProps> = ({ feature, children, fallback = null }) => {
  return useCan(feature, "add") ? <>{children}</> : <>{fallback}</>;
};

export const CanEdit: React.FC<GateProps> = ({ feature, children, fallback = null }) => {
  return useCan(feature, "write") ? <>{children}</> : <>{fallback}</>;
};

export const CanDelete: React.FC<GateProps> = ({ feature, children, fallback = null }) => {
  return useCan(feature, "delete") ? <>{children}</> : <>{fallback}</>;
};

/**
 * The universal UI gate. Renders children iff the user can view the feature.
 * Edit/Delete affordances are gated separately by the action-specific wrappers.
 */
export const FeatureUiGate: React.FC<GateProps> = ({ feature, children, fallback = null }) => {
  return useFeatureUiAccess(feature) ? <>{children}</> : <>{fallback}</>;
};

interface ReadOnlyBannerProps {
  feature: Feature;
  /** Override the default copy. */
  message?: string;
  /** sx override for the wrapping Alert. */
  sx?: object;
}

/**
 * Surfaces a soft "Read-only" banner at the top of a page when the user has
 * View on `feature` but neither Edit nor Delete. Renders null otherwise.
 */
export const ReadOnlyBanner: React.FC<ReadOnlyBannerProps> = ({ feature, message, sx }) => {
  const viewOnly = useIsViewOnly(feature);
  if (!viewOnly) return null;
  return (
    <Alert severity="info" icon={<VisibilityIcon fontSize="small" />} sx={{ mb: 2, ...sx }}>
      {message ?? "Read-only — contact your administrator to request edit access."}
    </Alert>
  );
};
