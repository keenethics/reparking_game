import ListOfParticipants from './ListOfParticipants';
import GameBoard from './GameBoard';
import ListOfCarActions from './ListOfCarActions';
import AppContext from '../context/AppContext';
import useStore from '../hooks/useStore';
import styles from '../styles/App.module.css';

function App() {
  const store = useStore();

  return (
    <AppContext.Provider value={store}>
      <div className={styles.container}>
        <div className={styles.content}>
          <ListOfParticipants />
          <GameBoard />
          <ListOfCarActions />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
