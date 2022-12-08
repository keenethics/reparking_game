import { useContext, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

import Timer from './Timer';
import CarModel from './CarModel';
import Car from '@reparking_game/shared/Car';
import Game from '@reparking_game/shared/Game';
import AppContext from '../../../context/AppContext';
import styles from '../../../styles/pages/GameRoom/Board.module.css';

function Board({ socket, userId }) {
  const context = useContext(AppContext);
  const {
    boardCells,
    setBoardCells,
    isGameStarted,
    isCarCrash,
    offenderBeforeMove,
    cars,
    initialTimerInSec,
    setInitialTimerInSec,
    timer,
    setTimer,
    endTimeOfTurn,
  } = context;
  const cellRefOnOver = useRef();
  const myCar = cars.find(c => c.userId === userId);

  const isCarWithinBorders = (car) => {
    if (!car) return false;

    switch(car.direction) {
      case Car.Direction.up:
      case Car.Direction.down:
        return car.coordinate.top >= Game.border.top
          && car.coordinate.top <= Game.border.bottom - Car.height
          && car.coordinate.left >= Game.border.left
          && car.coordinate.left <= Game.border.right - Car.width;
      case Car.Direction.left:
      case Car.Direction.right:
        return car.coordinate.top >= Game.border.top - Car.width / 2
          && car.coordinate.top <= Game.border.bottom - Car.height + Car.width / 2
          && car.coordinate.left >= Game.border.left + Car.height / 4
          && car.coordinate.left <= Game.border.right - Car.width - Car.height / 4;
    }
  };

  useEffect(() => {
    setBoardCells((prevCells) => {
      return prevCells.map(c => {
        const cell = { id: c.id, style: { ...c.style } };

        if (cell.style.boxShadow !== 'none') {
          cell.style.boxShadow = 'none';
        }

        return cell;
      });
    });

    if (isGameStarted && myCar?.hasTurn && !isCarCrash) {
      let shiftedCar;
      let cellsToHighlight = [];
      const availableActions = {};

      shiftedCar = Car.calcStepsForward(myCar, 1);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.goForward,
          numberOfSteps: 1,
        };
      }
      shiftedCar = Car.calcStepsForward(myCar, 2);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.goForward,
          numberOfSteps: 2,
        };
      }
      shiftedCar = Car.calcStepsForward(myCar, 3);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.goForward,
          numberOfSteps: 3,
        };
      }
      shiftedCar = Car.calcStepToLeftLane(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.goToLeftLane,
        };
      }
      shiftedCar = Car.calcStepToRightLane(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.goToRightLane,
        };
      }
      shiftedCar = Car.calcTurnForwardLeft(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.turnForwardLeft,
        };
      }
      shiftedCar = Car.calcTurnForwardRight(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.turnForwardRight,
        };
      }
      shiftedCar = Car.calcOneStepBack(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.goOneStepBack,
        };
      }
      shiftedCar = Car.calcTurnBackLeft(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.turnBackLeft,
        };
      }
      shiftedCar = Car.calcTurnBackRight(myCar);
      if (isCarWithinBorders(shiftedCar)) {
        cellsToHighlight.push(...shiftedCar.moves);
        availableActions[shiftedCar.moves[shiftedCar.moves.length - 1]] = {
          moves: shiftedCar.moves,
          moveType: Car.MoveType.turnBackRight,
        };
      }

      setBoardCells((prevCells) => {
        return prevCells.map(c => {
          const cell = { id: c.id, style: { ...c.style } };

          if (cellsToHighlight.includes(cell.id)) {
            cell.style.boxShadow = '0px 0px 0px 5px #00be00 inset';
          }
          cell.action = availableActions[cell.id];

          return cell;
        });
      });
    }
  }, [cars]);
  //}, [carWithTurn?.userId]);

  const handleSkipTurn = () => {
    socket.emit('car:skip-move');
  };

  const highlightMove = (event) => {
    if (!isGameStarted || !myCar?.hasTurn || isCarCrash) return;

    const { id: cellId } = event.target;
    cellRefOnOver.current = event.target;
    const cell = boardCells.find(c => c.id === cellId);

    if (cell.action) {
      const copyOfCells = JSON.parse(JSON.stringify(boardCells));
      cell.action.moves.forEach((m) => {
        const cellIndex = copyOfCells.findIndex(c => c.id === m);
        copyOfCells[cellIndex].style.boxShadow = '0px 0px 0px 5px #d6d600 inset';
      });
      setBoardCells(copyOfCells);
    }
  };

  const clearHighlightOfMove = (event) => {
    if (!isGameStarted || !myCar?.hasTurn || isCarCrash) return;

    flushSync(() => {

      setBoardCells((prevCells) => {
        return prevCells.map(c => {
          const cell = JSON.parse(JSON.stringify(c));

          if (cell.style.boxShadow !== 'none') {
            cell.style.boxShadow = '0px 0px 0px 5px #00be00 inset';
          }

          return cell;
        });
      });

    });
  };

  const makeMove = (event) => {
    if (!isGameStarted || !myCar?.hasTurn || isCarCrash) return;

    const { id: cellId } = event.target;

    const cell = boardCells.find(c => c.id === cellId);

    if (cell.action) {
      socket.emit('car:make-move', cell.action.moveType, cell.action.numberOfSteps);
    }
  };

  const handleCarCrash = () => {
    socket.emit('car:handle-crash');
  };

  return (
    <>
      <div className={styles.container}>
        <Timer
          socket={socket}
          myCar={myCar}
          isGameStarted={isGameStarted}
          initialTimerInSec={initialTimerInSec}
          setInitialTimerInSec={setInitialTimerInSec}
          timer={timer}
          setTimer={setTimer}
          endTimeOfTurn={endTimeOfTurn}
          isCarCrash={isCarCrash}
        />

        <div className={styles.rim}>
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
                id={cell.id}
                className={styles.cell}
                style={cell.style}
                onMouseOver={highlightMove}
                onMouseOut={clearHighlightOfMove}
                onClick={makeMove}
              />
            ))}
            {cars.map((car, idx) => (
              <CarModel key={idx} car={car} cellRefOnOver={cellRefOnOver} />
            ))}
          </div>
        </div>

        <div className={styles.skipBtnWrapper}>
          <button
            className={styles.skipBtn}
            onClick={handleSkipTurn}
            disabled={!isGameStarted || !myCar?.hasTurn || isCarCrash}
          >
            Skip
          </button>
        </div>
      </div>

      {isCarCrash && (
        <div className={styles.toastBg}>
          <div className={styles.toastCarCrash}>
            <div className={styles.toastTitle}>Car crash</div>
            {offenderBeforeMove?.userId === userId && (
              <button className={styles.toastBtn} onClick={handleCarCrash}>&#128110;</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Board;
