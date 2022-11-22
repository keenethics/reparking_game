import { useContext } from 'react';

import Timer from './Timer';
import CarModel from './CarModel';
import Information from './Information';
import Game from '@reparking_game/shared/Game';
import AppContext from '../../../context/AppContext';
import styles from '../../../styles/pages/GameRoom/Board.module.css';

function Board({ socket, userId }) {
  const context = useContext(AppContext);
  const {
    isGameStarted,
    isCarCrash,
    cars,
    boardCells,
    initialTimer,
    setInitialTimer,
    timer,
    setTimer,
    isTimerStopped,
    setIsTimerStopped,
  } = context;

  return (
    <div className={styles.container}>
      <Timer
        userId={userId}
        socket={socket}
        isGameStarted={isGameStarted}
        isCarCrash={isCarCrash}
        initialTimer={initialTimer}
        setInitialTimer={setInitialTimer}
        timer={timer}
        setTimer={setTimer}
        isTimerStopped={isTimerStopped}
        setIsTimerStopped={setIsTimerStopped}
        cars={cars}
      />
      <div
        className={styles.grid}
        style={{
          width: `${Game.cellWidth * Game.numberOfCellsHorizontally}px`,
          height: `${Game.cellHeight * Game.numberOfCellsVertically}px`,
          gridTemplateColumns: `repeat(${Game.numberOfCellsVertically}, ${Game.cellHeight}px)`,
          gridTemplateRows: `repeat(${Game.numberOfCellsHorizontally}, ${Game.cellWidth}px)`,
        }}
      >
        {boardCells.map((cell, idx) => (
          <div
            key={cell.id}
            className={styles.cell}
            style={cell.style}
          />
        ))}
        {cars.map((car, idx) => (
          <CarModel key={idx} car={car} />
        ))}
      </div>
      <Information cars={cars} />
    </div>
  );
}

export default Board;
