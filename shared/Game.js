const cellWidth = 75;
const cellHeight = 75;
const numberOfCellsVertically = 8;
const numberOfCellsHorizontally = 8;

const Game = {
  Mode: {
    solo: 'solo',
    duo: 'duo',
    quartet: 'quartet',
    octet: 'octet',
  },
  maxCars: 16,
  carsOnSide: 8,
  Side: {
    top: 'top',
    bottom: 'bottom',
  },
  cellWidth,
  cellHeight,
  numberOfCellsVertically,
  numberOfCellsHorizontally,
  border: {
    top: 0,
    left: 0,
    bottom: numberOfCellsVertically * cellHeight,
    right: numberOfCellsHorizontally * cellWidth,
  },
};

export default Game;
