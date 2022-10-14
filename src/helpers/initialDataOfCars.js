import CarDirection from './CarDirection';
import Game from './Game';
import TeamColor from './TeamColor';

const { numberOfTeams, numberOfPlayersInTeam, step } = Game;

function randomizePositionsOfCars(cars) {
  const randomizeSorting = (a, b) => {
    const random1 = Math.round(Math.random() * 10);
    const random2 = Math.round(Math.random() * 10);

    return (b + random1) - (a + random2);
  };
  const allPositions = new Array(numberOfTeams * numberOfPlayersInTeam).fill().map((item, i) => i + 1);
  const positionsOfTeam1 = allPositions.slice(0, numberOfPlayersInTeam);
  const positionsOfTeam2 = allPositions.slice(numberOfPlayersInTeam);

  positionsOfTeam1.sort(randomizeSorting);
  positionsOfTeam2.sort(randomizeSorting);
  const randomPositions = positionsOfTeam1.concat(positionsOfTeam2);

  return randomPositions.map((randomPosition, idx) => {
    const startPosition = randomPosition;
    const car = cars[idx];

    return {
      ...car,
      startPosition,
      coordinate: {
        top: car.teamColor === TeamColor.blue ? 0 : numberOfPlayersInTeam * step - Game.carHeight,
        left: car.teamColor === TeamColor.blue ? step * startPosition - step : step * (startPosition - numberOfPlayersInTeam) - step,
      },
    };
  });
}

let initialDataOfCars  = new Array(numberOfTeams * numberOfPlayersInTeam)
    .fill()
    .map((item, idx) => {
      const name = `Player${idx + 1}`;
      const teamColor = idx < numberOfPlayersInTeam ? TeamColor.blue : TeamColor.red;
      const direction = idx < numberOfPlayersInTeam ? CarDirection.down : CarDirection.up;

      return {
        name,
        number: idx + 1,
        teamColor,
        direction,
        penalty: 0,
      };
    });

initialDataOfCars = randomizePositionsOfCars(initialDataOfCars);

export default initialDataOfCars;
