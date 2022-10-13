import { useState } from 'react';

import ParticipantList from './ParticipantList.js';
import GameBoard from './GameBoard.js';
import CarActions from './CarActions.js';
import { CarDirection } from '../helpers';

import styles from '../styles/App.module.css';

function App() {
  const [car, setCar] = useState({
    number: 3,
    name: 'Player3',
    top: 225,
    left: 225,
    direction: CarDirection.up,
    penalty: 0,
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ParticipantList />
        <GameBoard car={car} />
        <CarActions car={car} setCar={setCar} />
      </div>
    </div>
  );
}

export default App;
