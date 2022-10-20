const Car = {
  step: 75,
  width: 75,
  height: 150,
  Direction: {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
  },
  calcStepsForward(car, numberOfSteps) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        top = top - numberOfSteps * step;
        break;
      case Direction.down:
        top = top + numberOfSteps * step;
        break;
      case Direction.left:
        left = left - numberOfSteps * step;
        break;
      case Direction.right:
        left = left + numberOfSteps * step;
        break;
    }

    return { ...car, coordinate: { top, left } };
  },
  calcOneStepBack(car) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        top += step;
        break;
      case Direction.down:
        top -= step;
        break;
      case Direction.left:
        left += step;
        break;
      case Direction.right:
        left -= step;
        break;
    }

    return { ...car, coordinate: { top, left } };
  },
  calcStepToLeftLane(car) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        top = top - 2 * step;
        left -= step;
        break;
      case Direction.down:
        top = top + 2 * step;
        left += step;
        break;
      case Direction.left:
        top += step;
        left = left - 2 * step;
        break;
      case Direction.right:
        top -= step;
        left = left + 2 * step;
        break;
    }

    return { ...car, coordinate: { top, left } };
  },
  calcStepToRightLane(car) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        top = top - 2 * step;
        left += step;
        break;
      case Direction.down:
        top = top + 2 * step;
        left -= step;
        break;
      case Direction.left:
        top -= step;
        left = left - 2 * step;
        break;
      case Direction.right:
        top += step;
        left = left + 2 * step;
        break;
    }

    return { ...car, coordinate: { top, left } };
  },
  calcTurnForwardLeft(car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.left;
        top = top - step - step / 2;
        left = left - step - step / 2;
        break;
      case Direction.down:
        direction = Direction.right;
        top = top + step + step / 2;
        left = left + step + step / 2;
        break;
      case Direction.left:
        direction = Direction.down;
        top = top + step + step / 2;
        left = left - step - step / 2;
        break;
      case Direction.right:
        direction = Direction.up;
        top = top - step - step / 2;
        left = left + step + step / 2;
        break;
    }

    return { ...car, direction, coordinate: { top, left } };
  },
  calcTurnForwardRight(car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.right;
        top = top - step - step / 2;
        left = left + step + step / 2;
        break;
      case Direction.down:
        direction = Direction.left;
        top = top + step + step / 2;
        left = left - step - step / 2;
        break;
      case Direction.left:
        direction = Direction.up;
        top = top - step - step / 2;
        left = left - step - step / 2;
        break;
      case Direction.right:
        direction = Direction.down;
        top = top + step + step / 2;
        left = left + step + step / 2;
        break;
    }

    return { ...car, direction, coordinate: { top, left } };
  },
  calcTurnBackLeft (car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.right;
        top = top + step + step / 2;
        left = left - step / 2;
        break;
      case Direction.down:
        direction = Direction.left;
        top = top - step - step / 2;
        left = left + step / 2;
        break;
      case Direction.left:
        direction = Direction.up;
        top = top + step / 2;
        left = left + step + step / 2;
        break;
      case Direction.right:
        direction = Direction.down;
        top = top - step / 2;
        left = left - step - step / 2;
        break;
    }

    return { ...car, direction, coordinate: { top, left } };
  },
  calcTurnBackRight (car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.left;
        top = top + step + step / 2;
        left = left + step / 2;
        break;
      case Direction.down:
        direction = Direction.right;
        top = top - step - step / 2;
        left = left - step / 2;
        break;
      case Direction.left:
        direction = Direction.down;
        top = top - step / 2;
        left = left + step + step / 2;
        break;
      case Direction.right:
        direction = Direction.up;
        top = top + step / 2;
        left = left - step - step / 2;
        break;
    }

    return { ...car, direction, coordinate: { top, left } };
  },
};

export default Car;
