import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./views/authentication/pages/login";
import Signup from "./views/authentication/pages/signup";
import ForgotPassword from "./views/authentication/pages/forgot-password";
import ResetPassword from "./views/authentication/pages/reset-password";
import { PrivateRoute } from "./views/shared/private-routes";
import { RequireAuth } from "./views/shared/require-auth";
import Dashboard from "./views/dashboard/Dashboard";
import ProfessionalDashboard from "./views/dashboard/ProfessionalDashboard";
import Roles from "./views/roles/Roles";
import Users from "./views/users/Users";
import CoquiQuestions from "./views/coqui/CoquiQuestions";
import Diagnostics from "./views/shared/Diagnostics";
import ComingSoon from "./views/shared/ComingSoon";
import CurriculumBuilder from "./views/curriculum/CurriculumBuilder";
import Landing from "./views/landing/Landing";
import PillarDetail from "./views/pillars/PillarDetail";
import MissionPage from "./views/pillars/mission/MissionPage";
import CurriculumSessionPage from "./views/pillars/mission/CurriculumSessionPage";
import MissionSessionOnePage from "./views/pillars/mission/MissionSessionOnePage";
import MissionSessionTwoPage from "./views/pillars/mission/MissionSessionTwoPage";
import MissionSessionThreePage from "./views/pillars/mission/MissionSessionThreePage";
import MissionConceptsPage from "./views/pillars/mission/MissionConceptsPage";
import MissionObjectivesPage from "./views/pillars/mission/MissionObjectivesPage";
import MissionPsychoeducationPage from "./views/pillars/mission/MissionPsychoeducationPage";
import MissionInterventionPage from "./views/pillars/mission/MissionInterventionPage";
import MissionProcessingPage from "./views/pillars/mission/MissionProcessingPage";
import MissionClosingPage from "./views/pillars/mission/MissionClosingPage";
import SessionOneComingSoonPage from "./views/pillars/mission/SessionOneComingSoonPage";
import GriefCurriculumPage from "./views/pillars/mission/GriefCurriculumPage";
import ImmersivePage from "./views/pillars/immersive/ImmersivePage";
import KindnessPage from "./views/pillars/kindness/KindnessPage"; // Coquí Research Data dashboard (lives under Mission)
import SurveyPage from "./views/pillars/kindness/SurveyPage";
import OnenessPage from "./views/pillars/oneness/OnenessPage";
import RevitalizationPage from "./views/pillars/revitalization/RevitalizationPage";
import AcceptancePage from "./views/pillars/AcceptancePage";
import KindnessPillarPage from "./views/pillars/kindness/KindnessPillarPage";
import WordsOfKindnessPage from "./views/pillars/kindness/WordsOfKindnessPage";
import LendAHandPage from "./views/pillars/kindness/LendAHandPage";
import HarmonyPage from "./views/pillars/harmony/HarmonyPage";
import LanguageSwitcher from "./views/shared/LanguageSwitcher";
import SiteHeader from "./views/shared/SiteHeader";
import { useAutoTranslate } from "./views/shared/useAutoTranslate";

// Pages that manage their own top-of-page chrome (no global SiteHeader).
const NO_HEADER = new Set(["/", "/login", "/signup", "/forgot-password", "/reset-password", "/dashboard", "/dashboard/professional", "/roles", "/users", "/coqui-questions", "/curriculums", "/diagnostics", "/profile", "/bookmarks", "/forum", "/messages", "/settings", "/help"]);
// Auth screens keep a floating language switcher; the landing page has its own.
const AUTH_PAGES = new Set(["/login", "/signup", "/forgot-password", "/reset-password"]);

const App: React.FC = () => {
  useAutoTranslate();
  const { pathname } = useLocation();
  // The landing carries its own corner controls (Dashboard + language), so the
  // site banner is for inner pages only — signed in or not.
  const showHeader = !NO_HEADER.has(pathname);
  const showFloatingLang = AUTH_PAGES.has(pathname);
  return (
    <>
      {showHeader && <SiteHeader />}
      {showFloatingLang && <LanguageSwitcher />}
      <Routes>
      {/* Public landing — the front door */}
      <Route path="/" element={<Landing />} />

      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      <Route path="/dashboard/professional" element={<PrivateRoute requireFeature="professional-dashboard" element={<ProfessionalDashboard />} />} />
      <Route path="/roles" element={<PrivateRoute requireFeature="roles" element={<Roles />} />} />
      <Route path="/users" element={<PrivateRoute requireFeature="users" element={<Users />} />} />
      <Route path="/coqui-questions" element={<PrivateRoute requireFeature="research" element={<CoquiQuestions />} />} />
      <Route path="/curriculums" element={<PrivateRoute requireFeature="curriculums" element={<CurriculumBuilder />} />} />

      {/* Member workspace — permissions and sidebar entries exist, the pages
          don't yet. Each is gated like a finished page, so building the real
          view later means swapping the element and nothing else. */}
      <Route path="/profile" element={<PrivateRoute requireFeature="profile" element={<ComingSoon titleKey="nav.profile" fallback="My Profile" />} />} />
      <Route path="/bookmarks" element={<PrivateRoute requireFeature="bookmarks" element={<ComingSoon titleKey="nav.bookmarks" fallback="Bookmarks" />} />} />
      <Route path="/forum" element={<PrivateRoute requireFeature="forum" element={<ComingSoon titleKey="nav.forum" fallback="Community Forum" />} />} />
      <Route path="/messages" element={<PrivateRoute requireFeature="messages" element={<ComingSoon titleKey="nav.messages" fallback="Messages" />} />} />
      <Route path="/settings" element={<PrivateRoute requireFeature="settings" element={<ComingSoon titleKey="nav.settings" fallback="Settings" />} />} />
      <Route path="/help" element={<PrivateRoute requireFeature="help-center" element={<ComingSoon titleKey="nav.helpCenter" fallback="Help Center" />} />} />
      {/* Public env/connectivity self-check */}
      <Route path="/diagnostics" element={<Diagnostics />} />

      {/* Full data-driven component pages */}
      {/* Public: the landing offers Mission to everyone, so it must open
          without a login. Its curriculum sub-pages below stay gated, and the
          "Explore curriculum" buttons gate on the curriculums permission. */}
      <Route path="/mission" element={<MissionPage />} />
      {/* Database-driven sessions. One template — Session 1's design — for
          every session of every stored curriculum. The hardcoded pages below
          stay as they are so the two can be compared. */}
      <Route path="/mission/c/:slug/session/:number" element={<RequireAuth element={<CurriculumSessionPage />} />} />
      <Route path="/mission/c/:slug/session/:number/:section" element={<RequireAuth element={<CurriculumSessionPage />} />} />
      <Route path="/mission/sessions" element={<Navigate to="/mission/sessions/1" replace />} />
      <Route path="/mission/sessions/1" element={<RequireAuth element={<MissionSessionOnePage />} />} />
      <Route path="/mission/sessions/1/concepts" element={<RequireAuth element={<MissionConceptsPage />} />} />
      <Route path="/mission/sessions/1/objectives" element={<RequireAuth element={<MissionObjectivesPage />} />} />
      <Route path="/mission/sessions/1/psychoeducation" element={<RequireAuth element={<MissionPsychoeducationPage />} />} />
      <Route path="/mission/sessions/1/intervention" element={<RequireAuth element={<MissionInterventionPage />} />} />
      <Route path="/mission/sessions/1/processing" element={<RequireAuth element={<MissionProcessingPage />} />} />
      <Route path="/mission/sessions/1/closing" element={<RequireAuth element={<MissionClosingPage />} />} />
      <Route path="/mission/sessions/1/:section" element={<RequireAuth element={<SessionOneComingSoonPage />} />} />
      <Route path="/mission/sessions/2" element={<RequireAuth element={<MissionSessionTwoPage />} />} />
      <Route path="/mission/sessions/2/:section" element={<RequireAuth element={<MissionSessionTwoPage />} />} />
      <Route path="/mission/sessions/3" element={<RequireAuth element={<MissionSessionThreePage />} />} />
      <Route path="/mission/sessions/3/:section" element={<RequireAuth element={<MissionSessionThreePage />} />} />
      <Route path="/mission/grief/session/1/:section" element={<RequireAuth element={<GriefCurriculumPage />} />} />
      {/* Coquí Research Data — reached from Mission's "Review Data" button */}
      <Route path="/mission/coqui" element={<RequireAuth element={<KindnessPage />} />} />
      <Route path="/mission/coqui/survey" element={<RequireAuth element={<SurveyPage />} />} />
      <Route path="/immersive" element={<RequireAuth element={<ImmersivePage />} />} />
      <Route path="/oneness" element={<RequireAuth element={<OnenessPage />} />} />
      <Route path="/revitalization" element={<RequireAuth element={<RevitalizationPage />} />} />
      <Route path="/acceptance" element={<RequireAuth element={<AcceptancePage />} />} />

      <Route path="/kindness" element={<RequireAuth element={<KindnessPillarPage />} />} />
      <Route path="/kindness/words" element={<RequireAuth element={<WordsOfKindnessPage />} />} />
      <Route path="/kindness/lend-a-hand" element={<RequireAuth element={<LendAHandPage />} />} />
      <Route path="/harmony" element={<RequireAuth element={<HarmonyPage />} />} />

      {/* Other pillar detail pages (image-based for now) */}
      <Route path="/:slug" element={<RequireAuth element={<PillarDetail />} />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
