import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { TFunction } from "i18next";
import { hasUiAccess } from "./permissions";

/**
 * Builds the Toolpad DashboardLayout sidebar navigation for the current user.
 * Administration (Users / Roles) shows only with the matching permissions and
 * comes first; Research (Coquí Questions) is visible to every authenticated user.
 */
export function getVisibleNavigation(userPermissions: string[], isGlobal: boolean, t: TFunction, roleName?: string) {
  const nav: any[] = [];

  if (roleName === "Professional") {
    return [
      {
        segment: "dashboard",
        title: t("nav.dashboard", "Dashboard"),
        icon: <DashboardRoundedIcon />,
      },
      { kind: "header", title: t("nav.professionalResources", "Professional Access") },
      {
        segment: "mission",
        title: t("nav.curriculums", "Curriculums"),
        icon: <AutoStoriesOutlinedIcon />,
      },
      {
        segment: "mission/coqui",
        title: t("nav.research", "Research"),
        icon: <SearchRoundedIcon />,
      },
    ];
  }

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
