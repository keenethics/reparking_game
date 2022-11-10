import AppContext from '../../context/AppContext';
import useStore from '../../hooks/useStore';
import GameRoom from '../pages/GameRoom/GameRoom';
import MainLayout from '../layouts/MainLayout';

function App() {
  const store = useStore();

  return (
    <AppContext.Provider value={store}>
      <MainLayout>
        <GameRoom />
      </MainLayout>
    </AppContext.Provider>
  );
}

export default App;
