const cellWidth = 75;
const cellHeight = 75;
const numberOfCellsVertically = 8;
const numberOfCellsHorizontally = 8;

const Game = {
  numberOfPlayersInTeam: 8,
  numberOfTeams: 2,
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
