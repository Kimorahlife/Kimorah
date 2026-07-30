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
import { canDoOn } from "./permissions";
import { getVisibleNavigation } from "./navigation";
import { getSession, SidebarFooter } from "./appProviderHelper";
import ToolbarActions from "./theme/ToolbarActions";
import AppTitle from "./theme/AppTitle";
import { resolveRoleName } from "../../utils/roleAliases";

interface PrivateRouteProps {
  element: ReactNode;
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
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
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
    () => roleState.list.find((r) => r.name === resolveRoleName(user?.roles)),
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
    () => getVisibleNavigation(userPermissions, isGlobal, t, user?.roles),
    [userPermissions, isGlobal, t, user?.roles]
  );

  if (!isTokenValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || JSON.stringify(user) === "") {
    return <Navigate to="/login" replace />;
  }

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
          {element}
        </Box>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
};
