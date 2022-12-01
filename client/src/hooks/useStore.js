import { useState } from 'react';
import Game from '@reparking_game/shared/Game';

const useStore = () => {
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
  const [cars, setCars] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCarCrash, setIsCarCrash] = useState(false);
  const [offenderBeforeMove, setOffenderBeforeMove] = useState(null);
  const [initialTimerInSec, setInitialTimerInSec] = useState('');
  const [timer, setTimer] = useState('');
  const [endTimeOfTurn, setEndTimeOfTurn] = useState('');

  return {
    boardCells,
    setBoardCells,
    cars,
    setCars,
    isGameStarted,
    setIsGameStarted,
    isCarCrash,
    setIsCarCrash,
    offenderBeforeMove,
    setOffenderBeforeMove,
    initialTimerInSec,
    setInitialTimerInSec,
    timer,
    setTimer,
    endTimeOfTurn,
    setEndTimeOfTurn,
  };
};

export default useStore;
