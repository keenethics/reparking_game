import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from './routes';

window.addEventListener('popstate', (event) => {
  window.location.reload();
});

function AppRouter() {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default AppRouter;
