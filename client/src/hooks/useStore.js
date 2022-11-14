import { useState } from 'react';
import { initialDataOfCars, Game } from '../helpers';

const useStore = () => {
  //const [cars, setCars] = useState(initialDataOfCars);
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
  const [initialTimer, setInitialTimer] = useState({ v: 30 });
  const [timer, setTimer] = useState({ v: 30 });
  const [isTimerStopped, setIsTimerStopped] = useState(true);
  // TODO: refactor in ListOfCarActions.js
  const goToNextCar = () => {
    const selectedCar = cars.find(item => item.isTurn);
    let copy = [...cars];
    copy[selectedCar.index] = { ...selectedCar, isTurn: false };

    let nextCar = copy.slice(selectedCar.index + 1).find(c => c.penalty === 0);

    if (nextCar) {
      copy[nextCar.index] = { ...nextCar, isTurn: true };
    } else {
      copy = copy.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      nextCar = copy.find(c => c.penalty === 0);

      if (!nextCar) {
        // setIsGameOver(true);
      } else {
        copy[nextCar.index] = { ...nextCar, isTurn: true };
      }
    }

    setCars(copy);
  };

  return {
    cars,
    setCars,
    boardCells,
    setBoardCells,
    initialTimer,
    setInitialTimer,
    timer,
    setTimer,
    isTimerStopped,
    setIsTimerStopped,
    goToNextCar,
  };
};

export default useStore;
