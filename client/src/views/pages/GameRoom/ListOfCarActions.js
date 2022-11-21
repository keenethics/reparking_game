import { useState, useContext } from 'react';

import Game from '@reparking_game/shared/Game';
import Car from '@reparking_game/shared/Car';
import AppContext from '../../../context/AppContext';
import styles from '../../../styles/pages/GameRoom/ListOfCarActions.module.css';

function ListOfCarActions({ socket, userId }) {
  const [isGameOver, setIsGameOver] = useState(false);
  const context = useContext(AppContext);
  const {
    isGameStarted,
    cars,
    setCars,
    boardCells,
    setBoardCells,
    isCarCrash,
    setIsCarCrash,
    offenderBeforeMove,
    initialTimer,
    setTimer,
    setIsTimerStopped,
  } = context;
  const selectedCar = cars.find(item => item.isTurn);

  const makeMove = (updatedCar) => {
    let copy = [...cars];
    copy[updatedCar.index] = { ...updatedCar, isTurn: false };

    // calculate cars positions
    copy = copy.map(c => {
      let rowIndex;
      let colIndex;

      if (updatedCar.index === c.index) {
        return c;
      }

      switch(c.direction) {
        case Car.Direction.up:
        case Car.Direction.down:
          rowIndex = c.coordinate.top / Game.cellHeight;
          colIndex = c.coordinate.left / Game.cellWidth;
          return {
            ...c,
            onCells: [
              `row${rowIndex + 1},col${colIndex + 1}`,
              `row${rowIndex + 2},col${colIndex + 1}`,
            ],
          };
        case Car.Direction.left:
        case Car.Direction.right:
          rowIndex = (c.coordinate.top + Car.width / 2) / Game.cellHeight;
          colIndex = (c.coordinate.left - Car.height / 4) / Game.cellWidth;
          return {
            ...c,
            onCells: [
              `row${rowIndex + 1},col${colIndex + 1}`,
              `row${rowIndex + 1},col${colIndex + 2}`,
            ],
          };
      }
    });
    /*********************/
    let offender = null;
    let victim = null;
    let isCrash = false;
    copy[updatedCar.index].moves.some(move => {
      copy.some(c => {
        if (updatedCar.index !== c.index && c.onCells.includes(move)) {
          isCrash = true;
          offender = copy[updatedCar.index];
          victim = c;
        }

        return isCrash;
      });

      return isCrash;
    });

    if (isCrash) {
      copy[offender.index] = { ...offender, penalty: offender.penalty + 2 };
      copy[victim.index] = { ...victim, penalty: victim.penalty + 1 };
    }

    // pass a turn
    let nextCar = copy.slice(updatedCar.index + 1).find(c => c.penalty === 0);

    if (nextCar) {
      copy[nextCar.index] = { ...nextCar, isTurn: true };
    } else {
      copy = copy.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      nextCar = copy.find(c => c.penalty === 0);

      if (!nextCar) {
        setIsGameOver(true);
      } else {
        copy[nextCar.index] = { ...nextCar, isTurn: true };
      }
    }
    /*********************/

    if (isCrash) {
      // setOffenderBeforeMove({ ...selectedCar });
      setCars(copy);
      setIsCarCrash(true);
      setIsTimerStopped(true);
    } else {
      setCars(copy);
      setTimer({ v: initialTimer.v });
    }

    /*********************/
    setBoardCells(boardCells.map(cell => {
      if (cell.style.boxShadow !== 'none') {
        return { ...cell, style: { ...cell.style, boxShadow: 'none' } };
      }
      return cell;
    }));
  };

  const handleSkipTurn = () => {
    let copy = [...cars];
    copy[selectedCar.index] = { ...selectedCar, isTurn: false };

    let nextCar = copy.slice(selectedCar.index + 1).find(c => c.penalty === 0);

    if (nextCar) {
      copy[nextCar.index] = { ...nextCar, isTurn: true };
    } else {
      copy = copy.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      nextCar = copy.find(c => c.penalty === 0);

      if (!nextCar) {
        setIsGameOver(true);
      } else {
        copy[nextCar.index] = { ...nextCar, isTurn: true };
      }
    }

    setCars(copy);
    //flushSync(() => setIsStopped(true));
    setTimer({ v: initialTimer.v });
    //setIsStopped(false);
  };

  /*********************************/
  const hasCarOwnerTurn = () => {
    return selectedCar ? selectedCar.userId === userId : false;
  };

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
          && car.coordinate.left <= Game.border.right- Car.width - Car.height / 4;
    }
  };

  const canGoForward = (numberOfSteps) => {
    const updatedCar = Car.calcStepsForward(selectedCar, numberOfSteps);
    return isCarWithinBorders(updatedCar);
  };

  const canGoOneStepBack = () => {
    const updatedCar = Car.calcOneStepBack(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const canGoToLeftLane = () => {
    const updatedCar = Car.calcStepToLeftLane(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const canGoToRightLane = () => {
    const updatedCar = Car.calcStepToRightLane(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const canTurnForwardLeft = () => {
    const updatedCar = Car.calcTurnForwardLeft(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const canTurnForwardRight = () => {
    const updatedCar = Car.calcTurnForwardRight(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const canTurnBackLeft = () => {
    const updatedCar = Car.calcTurnBackLeft(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const canTurnBackRight = () => {
    const updatedCar = Car.calcTurnBackRight(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const goForward = (numberOfSteps) => {
    socket.emit('car:make-move', Car.MoveType.goForward, numberOfSteps);

    /* TODO: remove cells highlight after click on each action
    setBoardCells(boardCells.map(cell => {
      if (cell.style.boxShadow !== 'none') {
        return { ...cell, style: { ...cell.style, boxShadow: 'none' } };
      }
      return cell;
    }));
    */
  };

  const goOneStepBack = () => {
    socket.emit('car:make-move', Car.MoveType.goOneStepBack);
  };

  const goToLeftLane = () => {
    socket.emit('car:make-move', Car.MoveType.goToLeftLane);
  };

  const goToRightLane = () => {
    socket.emit('car:make-move', Car.MoveType.goToRightLane);
  };

  const turnForwardLeft = () => {
    socket.emit('car:make-move', Car.MoveType.turnForwardLeft);
  };

  const turnForwardRight = () => {
    socket.emit('car:make-move', Car.MoveType.turnForwardRight);
  };

  const turnBackLeft = () => {
    socket.emit('car:make-move', Car.MoveType.turnBackLeft);
  };

  const turnBackRight = () => {
    socket.emit('car:make-move', Car.MoveType.turnBackRight);
  };
  /****************************************/

  const handleCarCrash = () => {
    socket.emit('car:crash');
  };

  // TODO: if a button is disabled then this function mustn't run
  const handleMouseOver = (funcName, numberOfSteps) => {
    const updatedCar = Car[funcName](selectedCar, numberOfSteps);
    const updatedCells = boardCells.map(cell => {
      if (updatedCar.moves.includes(cell.id)) {
        return {
          ...cell,
          style: {
            ...cell.style,
            boxShadow: '0px 0px 4px 2px green, 0px 0px 20px 2px green inset',
          },
        };
      }
      return cell;
    });

    setBoardCells(updatedCells);
  };

  // TODO: if a button is disabled then this function mustn't run
  const handleMouseOut = () => {
    setBoardCells(boardCells.map(cell => {
      if (cell.style.boxShadow !== 'none') {
        return { ...cell, style: { ...cell.style, boxShadow: 'none' } };
      }
      return cell;
    }));
  };

  return (
    <>
      {isCarCrash || isGameOver ? <div className={styles.toastBg} /> : null}

      <div className={styles.container}>
        <div className={styles.grid}>
          <button
            className={styles.item1}
            onClick={turnForwardLeft}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canTurnForwardLeft()}
            onMouseOver={() => handleMouseOver('calcTurnForwardLeft')}
            onMouseOut={handleMouseOut}
          >
            &#8624;
          </button>
          <button
            className={styles.item2}
            onClick={turnForwardRight}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canTurnForwardRight()}
            onMouseOver={() => handleMouseOver('calcTurnForwardRight')}
            onMouseOut={handleMouseOut}
          >
            &#8625;
          </button>

          <button
            className={styles.item3}
            onClick={() => goForward(3)}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canGoForward(3)}
            onMouseOver={() => handleMouseOver('calcStepsForward', 3)}
            onMouseOut={handleMouseOut}
          >
            &#8593;&#8593;&#8593;
          </button>
          <button
            className={styles.item4}
            onClick={() => goForward(2)}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canGoForward(2)}
            onMouseOver={() => handleMouseOver('calcStepsForward', 2)}
            onMouseOut={handleMouseOut}
          >
            &#8593;&#8593;
          </button>
          <button
            className={styles.item5}
            onClick={() => goForward(1)}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canGoForward(1)}
            onMouseOver={() => handleMouseOver('calcStepsForward', 1)}
            onMouseOut={handleMouseOut}
          >
            &#8593;
          </button>

          <button
            className={styles.item6}
            onClick={goToLeftLane}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canGoToLeftLane()}
            onMouseOver={() => handleMouseOver('calcStepToLeftLane')}
            onMouseOut={handleMouseOut}
          >
            &#8598;
          </button>
          <button
            className={styles.item7}
            onClick={goToRightLane}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canGoToRightLane()}
            onMouseOver={() => handleMouseOver('calcStepToRightLane')}
            onMouseOut={handleMouseOut}
          >
            &#8599;
          </button>

          <div className={styles.item8}>{selectedCar?.number}</div>

          <button
            className={styles.item9}
            onClick={goOneStepBack}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canGoOneStepBack()}
            onMouseOver={() => handleMouseOver('calcOneStepBack')}
            onMouseOut={handleMouseOut}
          >
            &#8595;
          </button>

          <button
            className={styles.item10}
            onClick={turnBackLeft}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canTurnBackLeft()}
            onMouseOver={() => handleMouseOver('calcTurnBackLeft')}
            onMouseOut={handleMouseOut}
          >
            &#8629;
          </button>
          <button
            className={styles.item11}
            onClick={turnBackRight}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash || !canTurnBackRight()}
            onMouseOver={() => handleMouseOver('calcTurnBackRight')}
            onMouseOut={handleMouseOut}
          >
            &#8627;
          </button>
        </div>

        <div className={styles.skipContainer}>
          <button
            className={styles.skipBtn}
            onClick={handleSkipTurn}
            disabled={!isGameStarted || !hasCarOwnerTurn() || isCarCrash}
          >
            Skip
          </button>
        </div>
        {isCarCrash && (
          <div className={styles.toastCarCrash}>
            <div className={styles.toastTitle}>Car crash</div>
            {offenderBeforeMove?.userId === userId && (
              <button className={styles.toastBtn} onClick={handleCarCrash}>&#128110;</button>
            )}
          </div>
        )}
      </div>
      {isGameOver && (
        <div className={styles.toastGameOver}>
          <div className={styles.toastTitle}>Game over</div>
          <button className={styles.toastBtn} disabled>&#10060;</button>
        </div>
      )}
    </>
  );
}

export default ListOfCarActions;
