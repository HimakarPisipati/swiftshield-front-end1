import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Pricing } from "./components/Pricing";
import { Claims } from "./components/Claims";
import { RiskInsights } from "./components/RiskInsights";
import { FraudDetection } from "./components/FraudDetection";
import { Onboarding } from "./components/Onboarding";
import { SubmitClaim } from "./components/SubmitClaim";
import { Login } from "./components/Login";

import { Settings } from "./components/Settings";
import ForgotPassword from "./components/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: Login },
      { path: "register", Component: Onboarding },
      { path: "dashboard", Component: Dashboard },
      { path: "pricing", Component: Pricing },
      { path: "claims", Component: Claims },
      { path: "insights", Component: RiskInsights },
      { path: "admin/fraud", Component: FraudDetection },
      { path: "onboarding", Component: Onboarding },
      { path: "submit-claim", Component: SubmitClaim },
      { path: "settings", Component: Settings },
      { path: "forgot-password", Component: ForgotPassword },
    ],
  },
]);
