import { createBrowserRouter } from "react-router";
import { Root } from "../components/Root";
import { Landing } from "../components/pages/Landing";
import { Onboarding } from "../components/pages/Onboarding";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { UpNext } from "../components/pages/UpNext";
import { UnifiedInbox } from "../components/pages/UnifiedInbox";
import { FeedSummary } from "../components/pages/FeedSummary";
import { ContactView } from "../components/pages/ContactView";
import { ContactSummary } from "../components/pages/ContactSummary";
import { ContactsOverview } from "../components/pages/ContactsOverview";
import { SmartFilters } from "../components/pages/SmartFilters";
import { IntegrationsEnhanced } from "../components/pages/IntegrationsEnhanced";
import { TeamManagement } from "../components/pages/TeamManagement";
import { SLADashboard } from "../components/pages/SLADashboard";
import { SearchResults } from "../components/pages/SearchResults";
import { PersonalSettings } from "../components/pages/PersonalSettings";
import { AuditLogs } from "../components/pages/AuditLogs";
import { NotFound } from "../components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireOnboarding>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: UpNext },
      { path: "inbox/:filter?", Component: UnifiedInbox },
      { path: "inbox/:filter/summary", Component: FeedSummary },
      { path: "contacts/overview", Component: ContactsOverview },
      { path: "contact/:contactId", Component: ContactView },
      { path: "contact/:contactId/summary", Component: ContactSummary },
      { path: "smart-filters", Component: SmartFilters },
      { path: "channel/:channel", Component: UnifiedInbox },
      { path: "channel/:channel/summary", Component: FeedSummary },
      { path: "integrations", Component: IntegrationsEnhanced },
      { path: "settings/team", Component: TeamManagement },
      { path: "settings/sla", Component: SLADashboard },
      { path: "settings/personal", Component: PersonalSettings },
      { path: "audit-logs", Component: AuditLogs },
      { path: "search", Component: SearchResults },
      { path: "*", Component: NotFound },
    ],
  },
]);