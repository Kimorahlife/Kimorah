import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/authentication/pages/login";
import Signup from "./views/authentication/pages/signup";
import ForgotPassword from "./views/authentication/pages/forgot-password";
import ResetPassword from "./views/authentication/pages/reset-password";
import { PrivateRoute } from "./views/shared/private-routes";
import Dashboard from "./views/dashboard/Dashboard";
import Landing from "./views/landing/Landing";
import PillarDetail from "./views/pillars/PillarDetail";
import MissionPage from "./views/pillars/mission/MissionPage";
import MissionSessionsPage from "./views/pillars/mission/MissionSessionsPage";
import MissionSessionOnePage from "./views/pillars/mission/MissionSessionOnePage";
import MissionConceptsPage from "./views/pillars/mission/MissionConceptsPage";
import MissionObjectivesPage from "./views/pillars/mission/MissionObjectivesPage";
import SessionOneComingSoonPage from "./views/pillars/mission/SessionOneComingSoonPage";
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

const App: React.FC = () => {
  return (
    <>
      <LanguageSwitcher />
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

      {/* Full data-driven component pages */}
      <Route path="/mission" element={<MissionPage />} />
      <Route path="/mission/sessions" element={<MissionSessionsPage />} />
      <Route path="/mission/sessions/1" element={<MissionSessionOnePage />} />
      <Route path="/mission/sessions/1/concepts" element={<MissionConceptsPage />} />
      <Route path="/mission/sessions/1/objectives" element={<MissionObjectivesPage />} />
      <Route path="/mission/sessions/1/:section" element={<SessionOneComingSoonPage />} />
      {/* Coquí Research Data — reached from Mission's "Review Data" button */}
      <Route path="/mission/coqui" element={<KindnessPage />} />
      <Route path="/mission/coqui/survey" element={<SurveyPage />} />
      <Route path="/immersive" element={<ImmersivePage />} />
      <Route path="/oneness" element={<OnenessPage />} />
      <Route path="/revitalization" element={<RevitalizationPage />} />
      <Route path="/acceptance" element={<AcceptancePage />} />

      <Route path="/kindness" element={<KindnessPillarPage />} />
      <Route path="/kindness/words" element={<WordsOfKindnessPage />} />
      <Route path="/kindness/lend-a-hand" element={<LendAHandPage />} />
      <Route path="/harmony" element={<HarmonyPage />} />

      {/* Other pillar detail pages (image-based for now) */}
      <Route path="/:slug" element={<PillarDetail />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
