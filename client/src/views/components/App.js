import { Suspense } from 'react';

import AppContext from '../../context/AppContext';
import useStore from '../../hooks/useStore';
import AppRouter from '../../router/AppRouter';

function App() {
  const store = useStore();

  return (
    <AppContext.Provider value={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </AppContext.Provider>
  );
}

export default App;
