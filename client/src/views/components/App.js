import AppContext from '../../context/AppContext';
import useStore from '../../hooks/useStore';
import AppRouter from '../../router/AppRouter';

function App() {
  const store = useStore();

  return (
    <AppContext.Provider value={store}>
      <AppRouter />
    </AppContext.Provider>
  );
}

export default App;
