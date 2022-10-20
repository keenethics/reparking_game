import { useState } from 'react';

import ListOfParticipants from './ListOfParticipants';
import GameBoard from './GameBoard';
import ListOfCarActions from './ListOfCarActions';
import { initialDataOfCars } from '../helpers';
import styles from '../styles/App.module.css';

function App() {
  const [cars, setCars] = useState(initialDataOfCars);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ListOfParticipants cars={cars} setCars={setCars} />
        <GameBoard cars={cars} />
        <ListOfCarActions cars={cars} setCars={setCars} />
      </div>
    </div>
  );
}

export default App;
