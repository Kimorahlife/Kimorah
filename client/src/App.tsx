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
import ImmersivePage from "./views/pillars/immersive/ImmersivePage";
import KindnessPage from "./views/pillars/kindness/KindnessPage"; // Coquí Research Data dashboard (lives under Mission)
import SurveyPage from "./views/pillars/kindness/SurveyPage";
import OnenessPage from "./views/pillars/oneness/OnenessPage";
import PillarPlaceholder from "./views/pillars/PillarPlaceholder";

const App: React.FC = () => {
  return (
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
      {/* Coquí Research Data — reached from Mission's "Review Data" button */}
      <Route path="/mission/coqui" element={<KindnessPage />} />
      <Route path="/mission/coqui/survey" element={<SurveyPage />} />
      <Route path="/immersive" element={<ImmersivePage />} />
      <Route path="/oneness" element={<OnenessPage />} />

      {/* Kindness — placeholder until its page is built */}
      <Route path="/kindness" element={<PillarPlaceholder title="Kindness" bg="/pillars/kindness-bg.jpg" />} />

      {/* Other pillar detail pages (image-based for now) */}
      <Route path="/:slug" element={<PillarDetail />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
