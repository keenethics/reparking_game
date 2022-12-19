import { Game, Car } from '@reparking_game/shared';
import TeamColor from './TeamColor.js';

const { numberOfTeams, numberOfPlayersInTeam } = Game;

function randomizeStartPositions(cars) {
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
    const topOffset = (Game.cellHeight * 2 - Car.height) / 2;
    const leftOffset = (Game.cellWidth - Car.width ) / 2;
    const updatedCar = {
      ...car,
      startPosition,
      coordinate: {
        top: car.teamColor === TeamColor.blue ? topOffset : ((Game.numberOfCellsVertically * Game.cellHeight - Car.height) - topOffset),
        left: car.teamColor === TeamColor.blue ? (startPosition * Game.cellWidth + leftOffset) : ((startPosition - numberOfPlayersInTeam) * Game.cellWidth) + leftOffset,
      },
    };
    delete updatedCar.index;

    return updatedCar;
  });
}

let initialDataOfCars = new Array(numberOfTeams * numberOfPlayersInTeam)
  .fill()
  .map((item, idx) => {
    const name = `Player${idx + 1}`;
    const teamColor = idx % 2 === 0 ? TeamColor.blue : TeamColor.red;
    const direction = idx % 2 === 0 ? Car.Direction.down : Car.Direction.up;

    return {
      index: idx,
      name,
      number: idx + 1,
      teamColor,
      direction,
      penalty: 0,
      hasTurn: false,
      isOnline: false,
      offlineSkips: 0,
    };
  });

initialDataOfCars = randomizeStartPositions(initialDataOfCars);

export default initialDataOfCars;
