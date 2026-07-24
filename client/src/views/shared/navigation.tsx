import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { TFunction } from "i18next";
import { hasUiAccess } from "./permissions";

/**
 * Builds the Toolpad DashboardLayout sidebar navigation for the current user.
 * Administration (Users / Roles) shows only with the matching permissions and
 * comes first; Research (Coquí Questions) is visible to every authenticated user.
 */
export function getVisibleNavigation(userPermissions: string[], isGlobal: boolean, t: TFunction) {
  const nav: any[] = [];

  const showUsers = hasUiAccess(userPermissions, "users", isGlobal);
  const showRoles = hasUiAccess(userPermissions, "roles", isGlobal);
  const showResearch = hasUiAccess(userPermissions, "research", isGlobal);

  // Administration — permission-gated, shown first.
  if (showUsers || showRoles) {
    nav.push({ kind: "header", title: t("nav.administration", "Administration") });
    if (showUsers) {
      nav.push({
        segment: "users",
        title: t("nav.users", "Users"),
        icon: <GroupRoundedIcon />,
      });
    }
    if (showRoles) {
      nav.push({
        segment: "roles",
        title: t("nav.roles", "Roles"),
        icon: <AdminPanelSettingsRoundedIcon />,
      });
    }
  }

  // Research — gated by the research permission.
  if (showResearch) {
    nav.push({ kind: "header", title: t("nav.research", "Research") });
    nav.push({
      segment: "coqui-questions",
      title: t("nav.coquiQuestions", "Coquí Questions"),
      icon: <QuizRoundedIcon />,
    });
  }

  return nav;
}
