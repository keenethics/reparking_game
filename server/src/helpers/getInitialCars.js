import { Game, Car } from '@reparking_game/shared';
import teamColors from './teamColors.js';

function randomizeStartPositions(cars) {
  const gameSide1 = cars.filter(car => car.gameSide === Game.Side.top);
  const gameSide2 = cars.filter(car => car.gameSide === Game.Side.bottom);
  const randomizeSorting = (carA, carB) => {
    const random1 = parseInt(Math.round(Math.random() * 10));
    const random2 = parseInt(Math.round(Math.random() * 10));

    return random1 - random2;
  };

  gameSide1.sort(randomizeSorting);
  gameSide2.sort(randomizeSorting);
  const randomizedCars = gameSide1.concat(gameSide2);

  return cars.map(car => {
    const startPosition = randomizedCars.findIndex(rCar => rCar.creationIdx === car.creationIdx);
    const topOffset = (Game.cellHeight * 2 - Car.height) / 2;
    const leftOffset = (Game.cellWidth - Car.width ) / 2;
    const updatedCar = {
      ...car,
      startPosition,
      coordinate: {
        top: car.gameSide === Game.Side.top ? topOffset : ((Game.numberOfCellsVertically * Game.cellHeight - Car.height) - topOffset),
        left: car.gameSide === Game.Side.top ? (startPosition * Game.cellWidth + leftOffset) : ((startPosition - Game.carsOnSide) * Game.cellWidth) + leftOffset,
      },
    };

    return updatedCar;
  });
}

function getInitialCars(gameMode) {
  let initialCars = new Array(Game.maxCars)
    .fill()
    .map((item, creationIdx) => {
      const name = `Player${creationIdx + 1}`;
      const gameSide = creationIdx % 2 === 0 ? Game.Side.top : Game.Side.bottom;
      const direction = creationIdx % 2 === 0 ? Car.Direction.down : Car.Direction.up;
      const isLeader = creationIdx === 0;
      let teamN;
      let teamColor;

      switch(gameMode) {
        case Game.Mode.solo: {
          teamN = 0;
          teamColor = teamColors[creationIdx];
          break;
        }
        case Game.Mode.duo: {
          const teams = [[], [], [], [], [], [], [], []];
          let i = 0;
          while (i < 16) {
            teams[0].push(i);
            teams[1].push(i + 1);
            teams[2].push(i + 2);
            teams[3].push(i + 3);
            teams[4].push(i + 4);
            teams[5].push(i + 5);
            teams[6].push(i + 6);
            teams[7].push(i + 7);
            i += 8;
          }
          teams.some((team, teamIdx) => {
            if (team.includes(creationIdx)) {
              teamN = teamIdx + 1;
              return true;
            }
          });
          teamColor = teamColors[teamN - 1];
          break;
        }
        case Game.Mode.quartet: {
          const teams = [[], [], [], []];
          let i = 0;
          while (i < 16) {
            teams[0].push(i)
            teams[1].push(i + 1)
            teams[2].push(i + 2)
            teams[3].push(i + 3)
            i += 4;
          }
          teams.some((team, teamIdx) => {
            if (team.includes(creationIdx)) {
              teamN = teamIdx + 1;
              return true;
            }
          });
          teamColor = teamColors[teamN - 1];
          break;
        }
        case Game.Mode.octet: {
          teamN = gameSide === Game.Side.top ? 1 : 2;
          teamColor = teamColors[teamN - 1];
          break;
        }
      }

      return {
        creationIdx,
        name,
        number: creationIdx + 1,
        gameSide,
        teamN,
        teamColor,
        direction,
        penalty: 0,
        hasTurn: false,
        isOnline: false,
        isLeader,
        offlineSkips: 0,
        onlineSkips: 0,
      };
    });
  initialCars = randomizeStartPositions(initialCars);

  return initialCars;
}

export default getInitialCars;
