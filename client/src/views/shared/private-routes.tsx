import React, { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { AppDispatch } from "../../store/store";
import { loadRoles } from "../../store/slices/roles";
import { useUser } from "../authentication/components/useUser";
import { useToken } from "../authentication/components/useToken";

interface PrivateRouteProps {
  element: ReactNode;
}

/**
 * Minimal protected-route guard + app shell.
 *
 * Redirects to /login when there is no valid token, otherwise renders the
 * protected element inside a lightweight top-bar shell. Roles are loaded on
 * auth so permission-aware UI (usePermission) has data to work with.
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const user = useUser();
  const location = useLocation();
  const [token, , isTokenValid] = useToken();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) dispatch(loadRoles(token));
  }, [token, dispatch]);

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!isTokenValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || JSON.stringify(user) === "") {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, color: "#fff" }}>
            Kimorah
          </Typography>
          <Button color="inherit" onClick={signOut} sx={{ color: "#fff" }}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
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
    </Box>
  );
};
