import CarDirection from './CarDirection';
import Game from './Game';
import TeamColor from './TeamColor';

const { numberOfTeams, numberOfPlayersInTeam, step } = Game;

function randomizePositionsOfCars(cars) {
  const team1 = cars.filter(car => car.teamColor === TeamColor.blue);
  const team2 = cars.filter(car => car.teamColor === TeamColor.red);
  const randomizeSorting = (carA, carB) => {
    const random1 = Math.round(Math.random() * 10);
    const random2 = Math.round(Math.random() * 10);

    return (carB.number + random1) - (carA.number + random2);
  };

  team1.sort(randomizeSorting);
  team2.sort(randomizeSorting);
  const randomizedCars = team1.concat(team2);

  return cars.map(car => {
    const startPosition = randomizedCars.findIndex(c => c.index === car.index);

    return {
      ...car,
      startPosition,
      coordinate: {
        top: car.teamColor === TeamColor.blue ? 0 : numberOfPlayersInTeam * step - Game.carHeight,
        left: car.teamColor === TeamColor.blue ? step * startPosition : step * (startPosition - numberOfPlayersInTeam),
      },
    };
  });
}

let initialDataOfCars  = new Array(numberOfTeams * numberOfPlayersInTeam)
    .fill()
    .map((item, idx) => {
      const name = `Player${idx + 1}`;
      const teamColor = idx % 2 === 0 ? TeamColor.blue : TeamColor.red;
      const direction = idx % 2 === 0 ? CarDirection.down : CarDirection.up;

      return {
        index: idx,
        name,
        number: idx + 1,
        teamColor,
        direction,
        penalty: 0,
        isTurn: idx > 0 ? false : true,
      };
    });

initialDataOfCars = randomizePositionsOfCars(initialDataOfCars);

export default initialDataOfCars;
