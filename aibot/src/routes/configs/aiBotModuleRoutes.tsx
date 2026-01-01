import { lazyImport } from '../lazyImport';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

const AiBotLayout = lazyImport(() => import('@/modules/ai-bot-module/components/AiBotLayout'));
const Dashboard = lazyImport(() => import('@/modules/ai-bot-module/pages/Dashboard'));
const BotWizard = lazyImport(() => import('@/modules/ai-bot-module/pages/BotWizard'));
const BotDetail = lazyImport(() => import('@/modules/ai-bot-module/pages/BotDetail'));
const TemplateSettings = lazyImport(() => import('@/modules/ai-bot-module/pages/TemplateSettings'));
const AiBotLogin = lazyImport(() => import('@/pages/AiBotLogin'));
const AiBotEmbed = lazyImport(() => import('@/modules/ai-bot-module/pages/AiBotEmbed'));
const AbWorkspaceSettings = lazyImport(() => import('@/modules/ai-bot-module/pages/AbWorkspaceSettings'));
const AbTeamMembers = lazyImport(() => import('@/modules/ai-bot-module/pages/AbTeamMembers'));
const AiBotSubscription = lazyImport(() => import('@/modules/ai-bot-module/pages/AiBotSubscription'));

export const aiBotModuleRoutes = [
  {
    path: '/ai-bot-login',
    element: <AiBotLogin />,
  },
  // Public embed route (no auth required)
  {
    path: '/embed/ai-bot/:botId',
    element: <AiBotEmbed />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/login">
        <AiBotLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'create',
        element: <BotWizard />,
      },
      {
        path: 'edit/:botId',
        element: <BotWizard />,
      },
      {
        path: 'detail/:botId',
        element: <BotDetail />,
      },
      {
        path: 'settings/templates/:projectId',
        element: <TemplateSettings />,
      },
      {
        path: 'workspace/settings',
        element: <AbWorkspaceSettings />,
      },
      {
        path: 'workspace/team',
        element: <AbTeamMembers />,
      },
      {
        path: 'subscription',
        element: <AiBotSubscription />,
      },
    ],
  },
];
