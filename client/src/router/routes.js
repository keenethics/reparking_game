import MainLayout from '../views/layouts/MainLayout';
import ErrorBoundary from '../views/components/ErrorBoundary';
import NoMatch from '../views/components/NoMatch';
import GameMenu from '../views/pages/GameMenu/GameMenu';
import GameRoom from '../views/pages/GameRoom/GameRoom';

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
        path: '/game/:gameId',
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
