import { Suspense } from 'react';

import AppContext from '../../context/AppContext';
import useStore from '../../hooks/useStore';
import AppRouter from '../../router/AppRouter';
import Spinner from './Spinner';

function App() {
  const store = useStore();

  return (
    <AppContext.Provider value={store}>
      <Suspense fallback={<Spinner />}>
        <AppRouter />
      </Suspense>
    </AppContext.Provider>
  );
}

export default App;
