import { CarDirection, Game } from '../helpers';
import styles from '../styles/CarActions.module.css';

const { step } = Game;

function CarActions({ cars, setCars }) {
  const car = cars.find(item => item.isTurn);

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

    const temp = [...cars];
    temp[car.index] = { ...car, coordinate: { top, left }, isTurn: false };
    const nextCarIdx = car.index + 1; // change id -> index
    temp[nextCarIdx] = { ...temp[nextCarIdx], isTurn: true };

    setCars(temp);
  };

  const goBackOneStep = () => {
    let { top, left } = car;

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

    setCars({ ...car, top, left });
  };

  const turnForwardLeft = () => {
    let { top, left, direction } = car;

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

    setCars({ ...car, top, left, direction });
  };

  const turnForwardRight = () => {
    let { top, left, direction } = car;

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

    setCars({ ...car, top, left, direction });
  };

  const goToLeftLane = () => {
    let { top, left } = car;

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

    setCars({ ...car, top, left });
  };

  const goToRightLane = () => {
    let { top, left } = car;

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

    setCars({ ...car, top, left });
  };

  const turnBackLeft = () => {
    let { top, left, direction } = car;

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

    setCars({ ...car, top, left, direction });
  };

  const turnBackRight = () => {
    let { top, left, direction } = car;

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

    setCars({ ...car, top, left, direction });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Car actions:</div>

      <div className={styles.grid}>
        <div className={styles.item1}>Forward</div>

        <button className={styles.item2} onClick={turnForwardLeft}>Turn Left</button>
        <button className={styles.item3} onClick={turnForwardRight}>Turn Right</button>

        <button className={styles.item4} onClick={() => goForward(3)}>3</button>
        <button className={styles.item5} onClick={() => goForward(2)}>2</button>
        <button className={styles.item6} onClick={() => goForward(1)} disabled={checkIfBoardEdge()}>1</button>

        <button className={styles.item7} onClick={goToLeftLane}>Lane Left</button>
        <button className={styles.item8} onClick={goToRightLane}>Lane Right</button>

        <div className={styles.item9}>Back</div>

        <button className={styles.item10} onClick={goBackOneStep}>1</button>

        <button className={styles.item11} onClick={turnBackLeft}>Turn Left</button>
        <button className={styles.item12} onClick={turnBackRight}>Turn Right</button>
      </div>
    </div>
  );
}

export default CarActions;
