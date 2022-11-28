import { useState } from 'react';
import Game from '@reparking_game/shared/Game';

const useStore = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [cars, setCars] = useState([]);
  const [boardCells, setBoardCells] = useState(
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
  const [isCarCrash, setIsCarCrash] = useState(false);
  const [offenderBeforeMove, setOffenderBeforeMove] = useState(null);
  const [initialTimer, setInitialTimer] = useState({ v: '' });
  const [timer, setTimer] = useState({ v: '' });
  const [isTimerStopped, setIsTimerStopped] = useState(true);

  return {
    cars,
    setCars,
    boardCells,
    setBoardCells,
    isGameStarted,
    setIsGameStarted,
    isCarCrash,
    setIsCarCrash,
    offenderBeforeMove,
    setOffenderBeforeMove,
    initialTimer,
    setInitialTimer,
    timer,
    setTimer,
    isTimerStopped,
    setIsTimerStopped,
  };
};

export default useStore;
