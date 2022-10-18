import { CarDirection, Game } from '../helpers';
import styles from '../styles/CarActions.module.css';

const { step } = Game;

function CarActions({ cars, setCars }) {
  const car = cars.find(item => item.isTurn);

  const updateCars = (updatedCar) => {
    const copy = [...cars];
    copy[updatedCar.index] = { ...updatedCar, isTurn: false };
    const nextCarIdx = updatedCar.index + 1;
    copy[nextCarIdx] = { ...copy[nextCarIdx], isTurn: true };

    setCars(copy);
  };

  const checkIfBoardEdge = () => {
    // if direction ...
    //return car.top === 400 ? true : false;
  };

  const goForward = (numberOfSteps) => {
    let { top, left } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        top = top - numberOfSteps * step;
        break;
      case CarDirection.down:
        top = top + numberOfSteps * step;
        break;
      case CarDirection.left:
        left = left - numberOfSteps * step;
        break;
      case CarDirection.right:
        left = left + numberOfSteps * step;
        break;
    }

    const updatedCar = { ...car, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const goBackOneStep = () => {
    let { top, left } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        top += step;
        break;
      case CarDirection.down:
        top -= step;
        break;
      case CarDirection.left:
        left += step;
        break;
      case CarDirection.right:
        left -= step;
        break;
    }

    const updatedCar = { ...car, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const turnForwardLeft = () => {
    let { top, left, direction } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        direction = CarDirection.left;
        top = top - step - step / 2;
        left = left - step - step / 2;
        break;
      case CarDirection.down:
        direction = CarDirection.right;
        top = top + step + step / 2;
        left = left + step + step / 2;
        break;
      case CarDirection.left:
        direction = CarDirection.down;
        top = top + step + step / 2;
        left = left - step - step / 2;
        break;
      case CarDirection.right:
        direction = CarDirection.up;
        top = top - step - step / 2;
        left = left + step + step / 2;
        break;
    }

    const updatedCar = { ...car, direction, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const turnForwardRight = () => {
    let { top, left, direction } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        direction = CarDirection.right;
        top = top - step - step / 2;
        left = left + step + step / 2;
        break;
      case CarDirection.down:
        direction = CarDirection.left;
        top = top + step + step / 2;
        left = left - step - step / 2;
        break;
      case CarDirection.left:
        direction = CarDirection.up;
        top = top - step - step / 2;
        left = left - step - step / 2;
        break;
      case CarDirection.right:
        direction = CarDirection.down;
        top = top + step + step / 2;
        left = left + step + step / 2;
        break;
    }

    const updatedCar = { ...car, direction, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const goToLeftLane = () => {
    let { top, left } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        top = top - 2 * step;
        left -= step;
        break;
      case CarDirection.down:
        top = top + 2 * step;
        left += step;
        break;
      case CarDirection.left:
        top += step;
        left = left - 2 * step;
        break;
      case CarDirection.right:
        top -= step;
        left = left + 2 * step;
        break;
    }

    const updatedCar = { ...car, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const goToRightLane = () => {
    let { top, left } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        top = top - 2 * step;
        left += step;
        break;
      case CarDirection.down:
        top = top + 2 * step;
        left -= step;
        break;
      case CarDirection.left:
        top -= step;
        left = left - 2 * step;
        break;
      case CarDirection.right:
        top += step;
        left = left + 2 * step;
        break;
    }

    const updatedCar = { ...car, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const turnBackLeft = () => {
    let { top, left, direction } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        direction = CarDirection.right;
        top = top + step + step / 2;
        left = left - step / 2;
        break;
      case CarDirection.down:
        direction = CarDirection.left;
        top = top - step - step / 2;
        left = left + step / 2;
        break;
      case CarDirection.left:
        direction = CarDirection.up;
        top = top + step / 2;
        left = left + step + step / 2;
        break;
      case CarDirection.right:
        direction = CarDirection.down;
        top = top - step / 2;
        left = left - step - step / 2;
        break;
    }

    const updatedCar = { ...car, direction, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  const turnBackRight = () => {
    let { top, left, direction } = car.coordinate;

    switch (car.direction) {
      case CarDirection.up:
        direction = CarDirection.left;
        top = top + step + step / 2;
        left = left + step / 2;
        break;
      case CarDirection.down:
        direction = CarDirection.right;
        top = top - step - step / 2;
        left = left - step / 2;
        break;
      case CarDirection.left:
        direction = CarDirection.down;
        top = top - step / 2;
        left = left + step + step / 2;
        break;
      case CarDirection.right:
        direction = CarDirection.up;
        top = top + step / 2;
        left = left - step - step / 2;
        break;
    }

    const updatedCar = { ...car, direction, coordinate: { top, left } };
    updateCars(updatedCar);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Car actions:</div>

      <div className={styles.grid}>
        <div className={styles.item1}>Forward</div>

        <button className={styles.item2} onClick={turnForwardLeft}>Turn Left</button>
        <button className={styles.item3} onClick={turnForwardRight}>Turn Right</button>

        <button className={styles.item4} onClick={() => goForward(3)}>&#11014;</button>
        <button className={styles.item5} onClick={() => goForward(2)}>&#8679;&#8679;</button>
        <button className={styles.item6} onClick={() => goForward(1)}>&#8593;</button>

        <button className={styles.item7} onClick={goToLeftLane}>Lane Left</button>
        <button className={styles.item8} onClick={goToRightLane}>Lane Right</button>

        <div className={styles.item9}>Back</div>

        <button className={styles.item10} onClick={goBackOneStep}>1</button>

        <button className={styles.item11} onClick={turnBackLeft}>&#8617;</button>
        <button className={styles.item12} onClick={turnBackRight}>Turn Right</button>
      </div>
    </div>
  );
}

export default CarActions;
