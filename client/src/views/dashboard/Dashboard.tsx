import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../authentication/components/useUser";
import { useToken } from "../authentication/components/useToken";
import { AppDispatch, getUser, getRole, getCoqui } from "../../store/store";
import { loadUsers } from "../../store/slices/users";
import { loadCoquiAggregates } from "../../store/slices/coqui";
import { useCan, useFeatureUiAccess, useCurrentRole } from "../shared/permissions";
import AccessRestricted from "../shared/AccessRestricted";

/** A single stat tile with a coloured left accent. */
const StatCard = ({
  icon,
  value,
  label,
  color,
  onClick,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
  color: string;
  onClick?: () => void;
}) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 2.5,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      borderLeft: `4px solid ${color}`,
      display: "flex",
      alignItems: "center",
      gap: 2,
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s",
      "&:hover": onClick ? { boxShadow: 3 } : undefined,
    }}
  >
    <Box sx={{ color, display: "flex" }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="h3" fontWeight={700} lineHeight={1}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Paper>
);

/**
 * Authenticated dashboard: a welcome header, permission-gated stat cards
 * (Users / Roles / Coquí participants), and quick actions. Everything an
 * admin can act on is gated by the client permission wrappers.
 */
export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [token] = useToken("");
  const user = useUser();

  const users = useSelector(getUser);
  const roles = useSelector(getRole);
  const coqui = useSelector(getCoqui);

  const canReadUsers = useCan("users", "read");
  const showUsers = useFeatureUiAccess("users");
  const showRoles = useFeatureUiAccess("roles");
  const showResearch = useFeatureUiAccess("research");
  const showDashboard = useFeatureUiAccess("dashboard");
  const showProfessionalDashboard = useFeatureUiAccess("professional-dashboard");
  const { isGlobal, permissions } = useCurrentRole();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  // Coquí participant count comes from the public aggregates endpoint.
  useEffect(() => {
    dispatch(loadCoquiAggregates(i18n.language));
  }, [dispatch, i18n.language]);

  // Load the user directory only when the viewer holds users:read — never call
  // the guarded endpoint for a plain User (avoids a 403).
  useEffect(() => {
    if (token && canReadUsers && users.list.length === 0) {
      dispatch(loadUsers(token));
    }
  }, [token, canReadUsers, users.list.length, dispatch]);

  // /dashboard is where login lands everyone, so send a user who only holds the
  // professional dashboard to theirs rather than showing them a wall.
  if (!showDashboard && showProfessionalDashboard) {
    return <Navigate to="/dashboard/professional" replace />;
  }

  // No dashboard permission at all (and not global) — nothing to show here.
  if (!isGlobal && (!showDashboard || permissions.length === 0)) {
    return <AccessRestricted />;
  }

  const stats = [
    showUsers && {
      icon: <ManageAccountsRoundedIcon fontSize="large" />,
      value: users.list.length,
      label: t("dashboard.totalUsers", "Total Users"),
      color: "#6540b2",
      onClick: () => navigate("/users"),
    },
    showRoles && {
      icon: <AdminPanelSettingsRoundedIcon fontSize="large" />,
      value: roles.list.length,
      label: t("dashboard.totalRoles", "Total Roles"),
      color: "#4a86c4",
      onClick: () => navigate("/roles"),
    },
    {
      icon: <PublicRoundedIcon fontSize="large" />,
      value: coqui.data?.totalParticipants ?? 0,
      label: t("dashboard.coquiParticipants", "Coquí Participants"),
      color: "#6fae5a",
      onClick: () => navigate("/mission/coqui"),
    },
  ].filter(Boolean) as Array<{
    icon: ReactNode;
    value: number;
    label: string;
    color: string;
    onClick: () => void;
  }>;

  const quickActions = [
    showRoles && { label: t("dashboard.manageRoles", "Manage Roles"), to: "/roles" },
    showUsers && { label: t("dashboard.manageUsers", "Manage Users"), to: "/users" },
    showResearch && { label: t("dashboard.coquiQuestions", "Coquí Questions"), to: "/coqui-questions" },
    { label: t("dashboard.reviewCoqui", "Review Coquí Data"), to: "/mission/coqui" },
    { label: t("dashboard.mission", "Mission"), to: "/mission" },
  ].filter(Boolean) as Array<{ label: string; to: string }>;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box mb={4}>
        <Typography variant="h2" fontWeight={700}>
          {t("dashboard.welcomeBack", { name: firstName })}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          {t("dashboard.subtitle", "Here's an overview of your Kimorah workspace.")}
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} mb={4}>
        {stats.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* Quick actions */}
      <Typography variant="h4" fontWeight={700} mb={1.5}>
        {t("dashboard.quickActions", "Quick Actions")}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1.5}>
        {quickActions.map((a) => (
          <Button
            key={a.to}
            variant="outlined"
            color="primary"
            endIcon={<ChevronRightRoundedIcon />}
            onClick={() => navigate(a.to)}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            {a.label}
          </Button>
        ))}
      </Stack>
    </Container>
  );
}
