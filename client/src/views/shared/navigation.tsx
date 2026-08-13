import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import type { ReactNode } from "react";
import { TFunction } from "i18next";
import { hasUiAccess } from "./permissions";
import type { Feature } from "./permissions/featurePermissions";

/**
 * Member workspace entries, in the order the design lists them. Each is gated
 * on its own feature, so a role can grant any subset. The pages behind them are
 * not built yet — every segment resolves to the shared "coming soon"
 * placeholder, and swapping in the real page later is a routing change only.
 */
const WORKSPACE_ITEMS: Array<{
  feature: Feature;
  segment: string;
  key: string;
  fallback: string;
  icon: ReactNode;
}> = [
  { feature: "profile", segment: "profile", key: "nav.profile", fallback: "My Profile", icon: <AccountCircleOutlinedIcon /> },
  { feature: "bookmarks", segment: "bookmarks", key: "nav.bookmarks", fallback: "Bookmarks", icon: <BookmarkBorderRoundedIcon /> },
  { feature: "forum", segment: "forum", key: "nav.forum", fallback: "Community Forum", icon: <ForumOutlinedIcon /> },
  { feature: "messages", segment: "messages", key: "nav.messages", fallback: "Messages", icon: <MailOutlineRoundedIcon /> },
  { feature: "settings", segment: "settings", key: "nav.settings", fallback: "Settings", icon: <SettingsOutlinedIcon /> },
  { feature: "help-center", segment: "help", key: "nav.helpCenter", fallback: "Help Center", icon: <HelpOutlineRoundedIcon /> },
];

/**
 * Builds the Toolpad DashboardLayout sidebar navigation for the current user.
 *
 * Every entry is derived from the viewer's permission keys — never from a role
 * name. A role called "Professional", "Clinician" or anything else gets the
 * Professional Access section purely by holding curriculums / research grants,
 * so new roles are created in the Roles UI with no code change here.
 *
 * Sections, in order: Dashboards (dashboard / professional-dashboard) → member
 * workspace (profile / bookmarks / forum / messages / settings / help-center,
 * rendered without a section header) → Professional Access (curriculums /
 * research) → Administration (users / roles / research management).
 */
export function getVisibleNavigation(userPermissions: string[], isGlobal: boolean, t: TFunction) {
  const nav: any[] = [];

  const showUsers = hasUiAccess(userPermissions, "users", isGlobal);
  const showRoles = hasUiAccess(userPermissions, "roles", isGlobal);
  const showResearch = hasUiAccess(userPermissions, "research", isGlobal);
  const showCurriculums = hasUiAccess(userPermissions, "curriculums", isGlobal);
  const showGroups = hasUiAccess(userPermissions, "groups", isGlobal);
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

  // Member workspace — sits directly under the dashboards, no section header,
  // matching the design. Each entry appears only for a role that grants it.
  for (const item of WORKSPACE_ITEMS) {
    if (!hasUiAccess(userPermissions, item.feature, isGlobal)) continue;
    nav.push({
      segment: item.segment,
      title: t(item.key, item.fallback),
      icon: item.icon,
    });
  }

  // Professional Access — the practitioner-facing surfaces.
  if (showCurriculums || showResearch || showGroups) {
    nav.push({ kind: "header", title: t("nav.professionalResources", "Professional Access") });
    if (showCurriculums) {
      nav.push({
        segment: "mission",
        title: t("nav.curriculums", "Curriculums"),
        icon: <AutoStoriesOutlinedIcon />,
      });
    }
    // Running a curriculum with a set of people. Sits beside the read-only
    // Curriculums entry because it is the practitioner's side of the same work.
    if (showGroups) {
      nav.push({
        segment: "groups",
        title: t("nav.groups", "Groups"),
        icon: <GroupsRoundedIcon />,
      });
    }
    if (showResearch) {
      nav.push({
        segment: "mission/coqui",
        title: t("nav.research", "Research (Coquí)"),
        icon: <SearchRoundedIcon />,
      });
    }
  }

  // Administration — user/role management plus the Coquí question bank.
  if (showUsers || showRoles || showResearch || showCurriculums) {
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
    // Authoring for the Mission curricula. It sits in Administration rather
    // than Professional Access because that section is for editing, and it
    // keeps the read-only "Curriculums" → /mission entry unambiguous.
    if (showCurriculums) {
      nav.push({
        segment: "curriculums",
        title: t("nav.curriculumBuilder", "Curriculum Builder"),
        icon: <MenuBookRoundedIcon />,
      });
    }
  }

  return nav;
}
