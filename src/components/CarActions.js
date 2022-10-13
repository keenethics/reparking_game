import { CarDirection } from '../helpers';

import styles from '../styles/CarActions.module.css';

const step = 75;

function CarActions({ car, setCar }) {
  const checkIfBoardEdge = () => {
    // if direction ...
    //return car.top === 400 ? true : false;
  };

  const goForward = (numberOfSteps) => {
    let { top, left } = car;

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

    setCar({ ...car, top, left });
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

    setCar({ ...car, top, left });
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

    setCar({ ...car, top, left, direction });
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

    setCar({ ...car, top, left, direction });
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

    setCar({ ...car, top, left });
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

    setCar({ ...car, top, left });
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

    setCar({ ...car, top, left, direction });
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

    setCar({ ...car, top, left, direction });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Car actions:</div>
      <div>
        Go forward:
        <button onClick={() => goForward(1)} disabled={checkIfBoardEdge()}>x1</button>
        <button onClick={() => goForward(2)}>x2</button>
        <button onClick={() => goForward(3)}>x3</button>
      </div>
      <div>
        Go to lane:
        <button onClick={goToLeftLane}>Left</button>
        <button onClick={goToRightLane}>Right</button>
      </div>
        Turn:
        <button onClick={turnForwardLeft}>Forward-Left</button>
        <button onClick={turnForwardRight}>Forward-Right</button>
      <div>
        Go back:
        <button onClick={goBackOneStep}>x1</button>
      </div>
      <div>
        Turn:
        <button onClick={turnBackLeft}>Back-Left</button>
        <button onClick={turnBackRight}>Back-Right</button>
      </div>
    </div>
  );
}

export default CarActions;
