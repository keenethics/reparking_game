import { lazy } from 'react';

import MainLayout from '../views/layouts/MainLayout';
import ErrorBoundary from '../views/components/ErrorBoundary';
import NoMatch from '../views/pages/NoMatch';
const GameMenu = lazy(() => import('../views/pages/GameMenu/GameMenu'));
const GameRoom = lazy(() => import('../views/pages/GameRoom/GameRoom'));

const routes = [
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <GameMenu />,
      },
      {
        path: '/game/:gameId/team/:teamN',
        element: <GameRoom />,
      },
      {
        path: '*',
        element: <NoMatch />,
      },
    ],
  },
];

export default routes;
