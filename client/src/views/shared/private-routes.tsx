import React, { ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@toolpad/core";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, persistor, getRole } from "../../store/store";
import { loadRoles } from "../../store/slices/roles";
import { loadUserIds, resetPresence } from "../../store/slices/presence";
import { useUser } from "../authentication/components/useUser";
import { useToken } from "../authentication/components/useToken";
import { canDoOn, hasUiAccess } from "./permissions";
import type { Feature } from "./permissions/featurePermissions";
import { getVisibleNavigation } from "./navigation";
import { getSession, SidebarFooter } from "./appProviderHelper";
import ToolbarActions from "./theme/ToolbarActions";
import AppTitle from "./theme/AppTitle";
import AccessRestricted from "./AccessRestricted";
import Spinner from "./buttons/Spinner";

interface PrivateRouteProps {
  element: ReactNode;
  /**
   * Feature the viewer must hold to open this page. Omit for pages that only
   * require a login, or that gate themselves (e.g. Dashboard, which redirects
   * to the professional dashboard rather than refusing).
   */
  requireFeature?: Feature;
}

interface Authentication {
  signIn: () => Promise<void>;
  signOut: () => void;
}

/**
 * Protected-route guard + Toolpad dashboard shell (top header + left sidebar).
 *
 * Redirects to /login without a valid token. Otherwise renders the protected
 * element inside a ReactRouterAppProvider + DashboardLayout: the sidebar nav is
 * built from the user's permissions, and the header carries the language picker
 * and the Account control (avatar + sign-out).
 *
 * With `requireFeature`, the page also enforces the permission the sidebar
 * already uses to decide visibility — so reaching it by typing the URL is
 * refused, not just unlinked. The refusal renders inside the shell, leaving the
 * nav intact so the user can go somewhere they do have access to.
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requireFeature }) => {
  const { t } = useTranslation();
  const user = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [token, , isTokenValid, removeToken] = useToken();
  const dispatch = useDispatch<AppDispatch>();
  const roleState = useSelector(getRole);

  useEffect(() => {
    if (token) dispatch(loadRoles(token));
  }, [token, dispatch]);

  // Resolve the current user's role from the DB-loaded roles list: its
  // permission keys and whether it's a global (full-access) role.
  const userRole = useMemo(
    () => roleState.list.find((r) => r.name === user?.roles),
    [roleState.list, user?.roles]
  );
  const userPermissions = userRole?.permissions ?? [];
  const isGlobal = userRole?.isGlobal ?? false;

  const canReadUsers = canDoOn(userPermissions, "users", "read", isGlobal);

  // Presence ("who's online") is a users:read admin feature — load it only when
  // permitted, so a plain User never hits the users:read-guarded /api/users/all.
  useEffect(() => {
    if (token && canReadUsers) dispatch(loadUserIds(token));
  }, [token, canReadUsers, dispatch]);

  const authentication: Authentication = useMemo(
    () => ({
      signIn: async () => {
        navigate("/login");
      },
      signOut: () => {
        removeToken();                    // clear localStorage + hook state
        dispatch(resetPresence());        // clear in-memory presence ids
        persistor.purge();                // drop persisted presence/coqui
        window.location.href = "/login";  // full reload → non-persisted slices reinit
      },
    }),
    [navigate, removeToken, dispatch]
  );

  const navigation = useMemo(
    () => getVisibleNavigation(userPermissions, isGlobal, t),
    [userPermissions, isGlobal, t]
  );

  if (!isTokenValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || JSON.stringify(user) === "") {
    return <Navigate to="/login" replace />;
  }

  // Roles load asynchronously, and until they arrive `userPermissions` is empty
  // — indistinguishable from "no access". Hold on a spinner until the list
  // resolves, so a permitted user never sees a false refusal and a forbidden one
  // never glimpses the page. If the fetch fails we stop waiting and fall through
  // to the check, which denies: unverifiable permission is not permission.
  // (A database with genuinely zero roles would spin, but nobody can hold a
  // permission in that state anyway — boot logs a warning for it.)
  const rolesPending =
    Boolean(requireFeature) && roleState.list.length === 0 && !roleState.error;

  const denied =
    Boolean(requireFeature) &&
    !rolesPending &&
    !hasUiAccess(userPermissions, requireFeature as Feature, isGlobal);

  const content = rolesPending ? <Spinner /> : denied ? <AccessRestricted /> : element;

  return (
    <ReactRouterAppProvider
      session={getSession(user)}
      authentication={authentication}
      navigation={navigation as any}
      theme={theme}
    >
      <DashboardLayout
        sx={{
          // Give the sidebar nav breathing room below the header banner so the
          // first section header ("Administration") doesn't crowd it, and add a
          // little space above each section header.
          "& .MuiDrawer-paper .MuiList-root": { pt: 2 },
          "& .MuiListSubheader-root": { pt: 1 },
        }}
        slots={{
          appTitle: AppTitle,
          sidebarFooter: SidebarFooter,
          toolbarActions: ToolbarActions,
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          {content}
        </Box>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
};
