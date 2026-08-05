import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToken } from "../authentication/components/useToken";

interface RequireAuthProps {
  element: ReactNode;
}

/**
 * Sign-in gate for content pages (pillars, mission, curriculum).
 *
 * Distinct from <PrivateRoute>, which additionally wraps its element in the
 * Toolpad DashboardLayout — correct for admin screens, wrong for these pages,
 * which carry the public SiteHeader chrome instead.
 *
 * SCOPE — read before relying on this for confidentiality:
 * this decides what React renders, nothing more. Every gated component and its
 * text is compiled into the public JS bundle, which the CDN serves to anyone
 * who asks, so this makes a page unreachable through the UI but NOT secret.
 * Content that must stay private has to be fetched from an authenticated API
 * rather than bundled. Disabling JavaScript does not defeat this guard — the
 * SPA renders nothing at all without JS.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ element }) => {
  const location = useLocation();
  const [, , isTokenValid] = useToken();

  if (!isTokenValid) {
    // Preserve where they were headed so login can bounce them back.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{element}</>;
};

export default RequireAuth;
