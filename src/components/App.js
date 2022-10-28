import { useState } from 'react';

import ListOfParticipants from './ListOfParticipants';
import GameBoard from './GameBoard';
import ListOfCarActions from './ListOfCarActions';
import { initialDataOfCars, Game } from '../helpers';
import styles from '../styles/App.module.css';

function App() {
  const [cars, setCars] = useState(initialDataOfCars);
  const [gridCells, setGridCells] = useState(
    new Array(64)
      .fill()
      .map((cell, idx) => {
        const rowN = Number.parseInt(idx / Game.numberOfCellsVertically) + 1;
        const colN = idx - ((rowN - 1) * Game.numberOfCellsHorizontally) + 1;

        return {
          id: `row${rowN},col${colN}`,
          style: {
            width: `${Game.cellWidth}px`,
            height: `${Game.cellHeight}px`,
            boxShadow: 'none',
          },
        };
      })
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ListOfParticipants cars={cars} setCars={setCars} />
        <GameBoard cars={cars} gridCells={gridCells} />
        <ListOfCarActions
          cars={cars}
          setCars={setCars}
          gridCells={gridCells}
          setGridCells={setGridCells}
        />
      </div>
    </div>
  );
}

export default App;
