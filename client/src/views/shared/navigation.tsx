import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import { TFunction } from "i18next";
import { hasUiAccess } from "./permissions";

/**
 * Builds the Toolpad DashboardLayout sidebar navigation for the current user.
 *
 * Every entry is derived from the viewer's permission keys — never from a role
 * name. A role called "Professional", "Clinician" or anything else gets the
 * Professional Access section purely by holding curriculums / research grants,
 * so new roles are created in the Roles UI with no code change here.
 *
 * Sections, in order: Dashboards (dashboard / professional-dashboard) →
 * Professional Access (curriculums / research) → Administration (users / roles
 * / research management).
 */
export function getVisibleNavigation(userPermissions: string[], isGlobal: boolean, t: TFunction) {
  const nav: any[] = [];

  const showUsers = hasUiAccess(userPermissions, "users", isGlobal);
  const showRoles = hasUiAccess(userPermissions, "roles", isGlobal);
  const showResearch = hasUiAccess(userPermissions, "research", isGlobal);
  const showCurriculums = hasUiAccess(userPermissions, "curriculums", isGlobal);
  const showDashboard = hasUiAccess(userPermissions, "dashboard", isGlobal);
  const showProfessionalDashboard = hasUiAccess(userPermissions, "professional-dashboard", isGlobal);

  // Dashboards — each is its own permission, so a role can grant one, the
  // other, or both. When only one is granted it is simply "Dashboard"; when
  // both are, they're labelled apart so the user can move between them.
  const bothDashboards = showDashboard && showProfessionalDashboard;
  if (showDashboard) {
    nav.push({
      segment: "dashboard",
      title: t("nav.dashboard", "Dashboard"),
      icon: <DashboardRoundedIcon />,
    });
  }
  if (showProfessionalDashboard) {
    nav.push({
      segment: "dashboard/professional",
      title: bothDashboards
        ? t("nav.professionalDashboard", "Professional Dashboard")
        : t("nav.dashboard", "Dashboard"),
      icon: <SpaceDashboardOutlinedIcon />,
    });
  }

  // Professional Access — the practitioner-facing surfaces.
  if (showCurriculums || showResearch) {
    nav.push({ kind: "header", title: t("nav.professionalResources", "Professional Access") });
    if (showCurriculums) {
      nav.push({
        segment: "mission",
        title: t("nav.curriculums", "Curriculums"),
        icon: <AutoStoriesOutlinedIcon />,
      });
    }
    if (showResearch) {
      nav.push({
        segment: "mission/coqui",
        title: t("nav.research", "Research"),
        icon: <SearchRoundedIcon />,
      });
    }
  }

  // Administration — user/role management plus the Coquí question bank.
  if (showUsers || showRoles || showResearch) {
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
    if (showResearch) {
      nav.push({
        segment: "coqui-questions",
        title: t("nav.coquiQuestions", "Coquí Questions"),
        icon: <QuizRoundedIcon />,
      });
    }
  }

  return nav;
}
