import { useState } from 'react';

import { Game, Car } from '../helpers';
import styles from '../styles/ListOfCarActions.module.css';

function ListOfCarActions({ cars, setCars }) {
  const [isCarCrash, setIsCarCrash] = useState(false);
  const selectedCar = cars.find(item => item.isTurn);

  const updateCars = (updatedCar) => {
    let copy = [...cars];
    copy[updatedCar.index] = { ...updatedCar, isTurn: false };
    let nextCar = copy.slice(updatedCar.index + 1).find(c => c.penalty === 0);

    if (nextCar) {
      copy[nextCar.index] = { ...nextCar, isTurn: true };
    } else {
      copy = copy.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      nextCar = copy.find(c => c.penalty === 0);

      if (!nextCar) {
        // game over - 0 turns left - all cars are blocked
      } else {
        copy[nextCar.index] = { ...nextCar, isTurn: true };
      }
    }

    setCars(copy);
  };

  const isCarWithinBorders = (car) => {
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

  const goForward = (numberOfSteps) => {
    const updatedCar = Car.calcStepsForward(selectedCar, numberOfSteps);
    updateCars(updatedCar);
  };

  const canGoForward = (numberOfSteps) => {
    const updatedCar = Car.calcStepsForward(selectedCar, numberOfSteps);
    return isCarWithinBorders(updatedCar);
  };

  const goOneStepBack = () => {
    const updatedCar = Car.calcOneStepBack(selectedCar);
    updateCars(updatedCar);
  };

  const canGoOneStepBack = () => {
    const updatedCar = Car.calcOneStepBack(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const goToLeftLane = () => {
    const updatedCar = Car.calcStepToLeftLane(selectedCar);
    updateCars(updatedCar);
  };

  const canGoToLeftLane = () => {
    const updatedCar = Car.calcStepToLeftLane(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const goToRightLane = () => {
    const updatedCar = Car.calcStepToRightLane(selectedCar);
    updateCars(updatedCar);
  };

  const canGoToRightLane = () => {
    const updatedCar = Car.calcStepToRightLane(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnForwardLeft = () => {
    const updatedCar = Car.calcTurnForwardLeft(selectedCar);
    updateCars(updatedCar);
  };

  const canTurnForwardLeft = () => {
    const updatedCar = Car.calcTurnForwardLeft(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnForwardRight = () => {
    const updatedCar = Car.calcTurnForwardRight(selectedCar);
    updateCars(updatedCar);
  };

  const canTurnForwardRight = () => {
    const updatedCar = Car.calcTurnForwardRight(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnBackLeft = () => {
    const updatedCar = Car.calcTurnBackLeft(selectedCar);
    updateCars(updatedCar);
  };

  const canTurnBackLeft = () => {
    const updatedCar = Car.calcTurnBackLeft(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  const turnBackRight = () => {
    const updatedCar = Car.calcTurnBackRight(selectedCar);
    updateCars(updatedCar);
  };

  const canTurnBackRight = () => {
    const updatedCar = Car.calcTurnBackRight(selectedCar);
    return isCarWithinBorders(updatedCar);
  };

  return (
    <>
      {isCarCrash && <div className={styles.toastBg} />}

      <div className={styles.container}>
        <div className={styles.title}>Car actions:</div>

        <div className={styles.grid}>
          <button
            className={styles.item1}
            onClick={turnForwardLeft}
            disabled={!canTurnForwardLeft()}
          >
            &#8624;
          </button>
          <button
            className={styles.item2}
            onClick={turnForwardRight}
            disabled={!canTurnForwardRight()}
          >
            &#8625;
          </button>

          <button
            className={styles.item3}
            onClick={() => goForward(3)}
            disabled={!canGoForward(3)}
          >
            &#8593;&#8593;&#8593;
          </button>
          <button
            className={styles.item4}
            onClick={() => goForward(2)}
            disabled={!canGoForward(2)}
          >
            &#8593;&#8593;
          </button>
          <button
            className={styles.item5}
            onClick={() => goForward(1)}
            disabled={!canGoForward(1)}
          >
            &#8593;
          </button>

          <button
            className={styles.item6}
            onClick={goToLeftLane}
            disabled={!canGoToLeftLane()}
          >
            &#8598;
          </button>
          <button
            className={styles.item7}
            onClick={goToRightLane}
            disabled={!canGoToRightLane()}
          >
            &#8599;
          </button>

          <button
            className={styles.item8}
            onClick={goOneStepBack}
            disabled={!canGoOneStepBack()}
          >
            &#8595;
          </button>

          <button
            className={styles.item9}
            onClick={turnBackLeft}
            disabled={!canTurnBackLeft()}
          >
            &#8629;
          </button>
          <button
            className={styles.item10}
            onClick={turnBackRight}
            disabled={!canTurnBackRight()}
          >
            &#8627;
          </button>
        </div>

        {isCarCrash && (
          <div className={styles.toastContainer}>
            <div className={styles.toastTitle}>Car crash</div>
            <button className={styles.toastBtn}>&#128176;</button>
          </div>
        )}
      </div>
    </>
  );
}

export default ListOfCarActions;
