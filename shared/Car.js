import Game from './Game';

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
  MoveType: {
    goForward: 'go_forward',
    goToLeftLane: 'go_to_left_lane',
    goToRightLane: 'go_to_right_lane',
    turnForwardLeft: 'turn_forward_left',
    turnForwardRight: 'turn_forward_right',
    goOneStepBack: 'go_one_step_back',
    turnBackLeft: 'turn_back_left',
    turnBackRight: 'turn_back_right',
  },
  calcStepsForward(car, numberOfSteps) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        top = top - numberOfSteps * step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        if (numberOfSteps === 1) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 1}`,
          ];
        }
        if (numberOfSteps === 2) {
          moves = [
            `row${rowIndex + 2},col${colIndex + 1}`,
            `row${rowIndex + 1},col${colIndex + 1}`,
          ];
        }
        if (numberOfSteps === 3) {
          moves = [
            `row${rowIndex + 3},col${colIndex + 1}`,
            `row${rowIndex + 2},col${colIndex + 1}`,
            `row${rowIndex + 1},col${colIndex + 1}`,
          ];
        }
        break;
      case Direction.down:
        top = top + numberOfSteps * step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        if (numberOfSteps === 1) {
          moves = [
            `row${rowIndex + 2},col${colIndex + 1}`,
          ];
        }
        if (numberOfSteps === 2) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 2},col${colIndex + 1}`,
          ];
        }
        if (numberOfSteps === 3) {
          moves = [
            `row${rowIndex + 0},col${colIndex + 1}`,
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 2},col${colIndex + 1}`,
          ];
        }
        break;
      case Direction.left:
        left = left - numberOfSteps * step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        if (numberOfSteps === 1) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 1}`,
          ];
        }
        if (numberOfSteps === 2) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 2}`,
            `row${rowIndex + 1},col${colIndex + 1}`,
          ];
        }
        if (numberOfSteps === 3) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 3}`,
            `row${rowIndex + 1},col${colIndex + 2}`,
            `row${rowIndex + 1},col${colIndex + 1}`,
          ];
        }
        break;
      case Direction.right:
        left = left + numberOfSteps * step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        if (numberOfSteps === 1) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 2}`,
          ];
        }
        if (numberOfSteps === 2) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 1},col${colIndex + 2}`,
          ];
        }
        if (numberOfSteps === 3) {
          moves = [
            `row${rowIndex + 1},col${colIndex + 0}`,
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 1},col${colIndex + 2}`,
          ];
        }
        break;
    }

    return { ...car, coordinate: { top, left }, moves };
  },
  calcOneStepBack(car) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        top += step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [`row${rowIndex + 2},col${colIndex + 1}`];
        break;
      case Direction.down:
        top -= step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [`row${rowIndex + 1},col${colIndex + 1}`];
        break;
      case Direction.left:
        left += step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [`row${rowIndex + 1},col${colIndex + 2}`];
        break;
      case Direction.right:
        left -= step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [`row${rowIndex + 1},col${colIndex + 1}`];
        break;
    }

    return { ...car, coordinate: { top, left }, moves };
  },
  calcStepToLeftLane(car) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        top = top - 2 * step;
        left -= step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 2},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.down:
        top = top + 2 * step;
        left += step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
        ];
        break;
      case Direction.left:
        top += step;
        left = left - 2 * step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 2}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.right:
        top -= step;
        left = left + 2 * step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
        ];
        break;
    }

    return { ...car, coordinate: { top, left }, moves };
  },
  calcStepToRightLane(car) {
    if (!car) return;

    let { top, left } = car.coordinate;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        top = top - 2 * step;
        left += step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 2},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.down:
        top = top + 2 * step;
        left -= step;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
        ];
        break;
      case Direction.left:
        top -= step;
        left = left - 2 * step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 2}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.right:
        top += step;
        left = left + 2 * step;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
        ];
        break;
    }

    return { ...car, coordinate: { top, left }, moves };
  },
  calcTurnForwardLeft(car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.left;
        top = top - step - step / 2;
        left = left - step - step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 3}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.down:
        direction = Direction.right;
        top = top + step + step / 2;
        left = left + step + step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 0}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
        ];
        break;
      case Direction.left:
        direction = Direction.down;
        top = top + step + step / 2;
        left = left - step - step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 0},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
        ];
        break;
      case Direction.right:
        direction = Direction.up;
        top = top - step - step / 2;
        left = left + step + step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 3},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
    }

    return { ...car, direction, coordinate: { top, left }, moves };
  },
  calcTurnForwardRight(car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.right;
        top = top - step - step / 2;
        left = left + step + step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 0}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
        ];
        break;
      case Direction.down:
        direction = Direction.left;
        top = top + step + step / 2;
        left = left - step - step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 3}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.left:
        direction = Direction.up;
        top = top - step - step / 2;
        left = left - step - step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 3},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.right:
        direction = Direction.down;
        top = top + step + step / 2;
        left = left + step + step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 0},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
        ];
        break;
    }

    return { ...car, direction, coordinate: { top, left }, moves };
  },
  calcTurnBackLeft (car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.right;
        top = top + step + step / 2;
        left = left - step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 2}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.down:
        direction = Direction.left;
        top = top - step - step / 2;
        left = left + step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
        ];
        break;
      case Direction.left:
        direction = Direction.up;
        top = top + step / 2;
        left = left + step + step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
        ];
        break;
      case Direction.right:
        direction = Direction.down;
        top = top - step / 2;
        left = left - step - step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 2},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
    }

    return { ...car, direction, coordinate: { top, left }, moves };
  },
  calcTurnBackRight (car) {
    if (!car) return;

    let { direction, coordinate: { top, left } } = car;
    const { step, Direction } = this;
    let moves = [];
    let rowIndex;
    let colIndex;

    switch (car.direction) {
      case Direction.up:
        direction = Direction.left;
        top = top + step + step / 2;
        left = left + step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 2}`,
        ];
        break;
      case Direction.down:
        direction = Direction.right;
        top = top - step - step / 2;
        left = left - step / 2;
        rowIndex = (top + Car.width / 2) / Game.cellHeight;
        colIndex = (left - Car.height / 4) / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 2}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.left:
        direction = Direction.down;
        top = top - step / 2;
        left = left + step + step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 2},col${colIndex + 1}`,
          `row${rowIndex + 1},col${colIndex + 1}`,
        ];
        break;
      case Direction.right:
        direction = Direction.up;
        top = top + step / 2;
        left = left - step - step / 2;
        rowIndex = top / Game.cellHeight;
        colIndex = left / Game.cellWidth;
        moves = [
          `row${rowIndex + 1},col${colIndex + 1}`,
          `row${rowIndex + 2},col${colIndex + 1}`,
        ];
        break;
    }

    return { ...car, direction, coordinate: { top, left }, moves };
  },
};

export default Car;
