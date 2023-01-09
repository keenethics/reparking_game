import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import scheduler from 'node-schedule';

import games from './store/games.js';
import getInitialCars from './helpers/getInitialCars.js';
import { Game, Car } from '@reparking_game/shared';

const SERVER_PORT = process.env.SERVER_PORT;
const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());

if (process.env.NODE_ENV === 'production') {
  expressApp.use(express.static(path.join(process.cwd(), 'client_build')));
  expressApp.get('/*', function (req, res) {
    res.sendFile(path.join(process.cwd(), 'client_build', 'index.html'));
  });
}

expressApp.post('/api/game/create', (req, res) => {
  try {
    const { mode } = req.body;

    if (!Game.Mode[mode]) {
      throw new Error('Invalid game mode');
    }
    let urls = [];
    const randomGameId = uuidv4();

    for (let i = 0; i < 8; i++) {
      if (mode === Game.Mode.solo) {
        urls.push(`/game/${randomGameId}/team/${i}`);
        break;
      } else if (mode === Game.Mode.duo) {
        urls.push(`/game/${randomGameId}/team/${i + 1}`);
      } else if (mode === Game.Mode.quartet && i < 4) {
        urls.push(`/game/${randomGameId}/team/${i + 1}`);
      } else if (mode === Game.Mode.octet && i < 2) {
        urls.push(`/game/${randomGameId}/team/${i + 1}`);
      } else {
        break;
      }
    }
    games[randomGameId] = {
      initialCars: getInitialCars(mode),
      assignedCars: [],
      isGameStarted: false,
      isCarCrash: false,
      offenderBeforeMove: null,
      initialTimerInSec: 30,
      endTimeOfTurn: null,
      turnTransfer: null,
      createdAt: new Date(),
      mode,
      urls,
    };
    function removeIdleGames() {
      const msInHour = 8 * 60 * 60 * 1000;
      Object.keys(games).forEach((key) => {
        const game = games[key];

        if (!game.isGameStarted && (Date.now() - game.createdAt.getTime()) > msInHour) {
          delete games[key];
        }
      });
    }
    removeIdleGames();

    res.send({ urls, mode });
  } catch(err) {
    res.status(err.status || 500).send({ error: { name: err.name, message: err.message } });
  }
});

const httpServer = http.createServer(expressApp);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SERVER_CORS_ORIGIN,
  },
});

function calcEndTimeOfTurn (initialTimerInSec) {
  const NETWORK_DELAY = 999;

  return new Date(Date.now() + NETWORK_DELAY + initialTimerInSec * 1000);
}

// TODO: refactor
const makeMove = (shiftedCar, gameId) => {
  const game = games[gameId];
  let copyOfCars = JSON.parse(JSON.stringify(game.assignedCars));
  shiftedCar.offlineSkips = 0;
  shiftedCar.onlineSkips = 0;
  shiftedCar.hasTurn = false;
  const indexOfShiftedCar = copyOfCars.findIndex(c => c.userId === shiftedCar.userId);
  copyOfCars[indexOfShiftedCar] = shiftedCar;

  /* **** calculate cars positions on cells **** */
  copyOfCars = copyOfCars.map(c => {
    let rowIndex;
    let colIndex;

    if (c.userId === shiftedCar.userId) {
      return c;
    }

    switch(c.direction) {
      case Car.Direction.up:
      case Car.Direction.down:
        rowIndex = parseInt(c.coordinate.top / Game.cellHeight);
        colIndex = parseInt(c.coordinate.left / Game.cellWidth);
        return {
          ...c,
          onCells: [
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 2},col${colIndex + 1}`,
          ],
        };
      case Car.Direction.left:
      case Car.Direction.right:
        rowIndex = parseInt((c.coordinate.top + Car.width / 2) / Game.cellHeight);
        colIndex = parseInt((c.coordinate.left - Car.height / 4) / Game.cellWidth);
        return {
          ...c,
          onCells: [
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 1},col${colIndex + 2}`,
          ],
        };
    }
  });
  /* ******************* */

  /* ********* is there car crash ********** */
  let offender = null;
  let victim = null;
  let isCrash = false;
  shiftedCar.moves.some(move => {
    copyOfCars.some(c => {
      if (shiftedCar.userId !== c.userId && c.onCells.includes(move)) {
        isCrash = true;
        offender = shiftedCar;
        victim = c;
      }

      return isCrash;
    });

    return isCrash;
  });

  if (isCrash) {
    copyOfCars = copyOfCars.map(c => {
      if (c.userId === offender.userId) {
        c = { ...offender, penalty: offender.penalty + 2 };
      }
      if (c.userId === victim.userId) {
        c = { ...victim, penalty: victim.penalty + 1 };
      }

      return c;
    });
  }

  /* ******** pass a turn ********* */
  const nextCarInRound = copyOfCars.slice(indexOfShiftedCar + 1).find(c => c.penalty === 0);

  if (nextCarInRound) {
    nextCarInRound.hasTurn = true;
  } else {
    copyOfCars = copyOfCars.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
    const nextCarInNextRound = copyOfCars.find(c => c.penalty === 0);

    if (!nextCarInNextRound) {
      // setIsGameOver(true);
    } else {
      nextCarInNextRound.hasTurn = true;
    }
  }
  /* ******************* */

  if (isCrash) {
    game.isCarCrash = true;
    game.offenderBeforeMove = game.assignedCars[indexOfShiftedCar];
    game.assignedCars = copyOfCars;
    game.turnTransfer.cancel();
  } else {
    game.assignedCars = copyOfCars;
    game.endTimeOfTurn = calcEndTimeOfTurn(game.initialTimerInSec);
    game.turnTransfer.reschedule(game.endTimeOfTurn);
  }
};

io.use((socket, next) => {
  const { gameId, userId, teamN } = socket.handshake.auth;

  if (gameId) {
    const game = games[gameId];

    if (!game) {
      return next(new Error('Game does not exist'));
    }
    if (!game.urls.includes(`/game/${gameId}/team/${teamN}`)) {
      return next(new Error('Team does not exist'));
    }
    const carOfPlayer = game.assignedCars.find(c => c.userId === userId);

    const parsedTeamN = parseInt(teamN);
    if (!carOfPlayer && !game.isGameStarted && !game.initialCars.find(c => c.teamN === parsedTeamN)) {
      return next(new Error('Team is full of players'));
    }
    if (!carOfPlayer && !game.isGameStarted && game.assignedCars.length === 16) {
      return next(new Error('Game is full of players'));
    }
    if (!carOfPlayer && game.isGameStarted) {
      return next(new Error('Game already started'));
    }
    if (carOfPlayer && carOfPlayer.teamN !== parsedTeamN) {
      return next(new Error('Invalid url'));
    }
  }

  next();
});

io.on('connection', (socket) => {
  console.log('+ user connected', socket.id, socket.handshake);

  socket.on('game:join', () => {
    console.log('game:join - handshake', socket.handshake);

    const { userId, gameId, teamN } = socket.handshake.auth;
    const game = games[gameId];
    socket.join(gameId); // TODO: check if there is not duplicate & if it needs to remove socket from room
    const assignedCar = game.assignedCars.find(item => item.userId === userId);

    if (assignedCar) {
      assignedCar.isOnline = true;
    }
    if (!assignedCar && game.initialCars.length) {
      const parsedTeamN = parseInt(teamN);
      const indexOfNewCar = game.initialCars.findIndex(c => c.teamN === parsedTeamN);
      const [newCar] = game.initialCars.splice(indexOfNewCar, 1);
      game.assignedCars.push(
        {
          ...newCar,
          userId,
          isOnline: true,
        },
      );
      game.assignedCars.sort((carA, carB) => carA.number - carB.number);
    }

    console.log('game:join - games: ', games);

    io.to(gameId).emit(
      'game:join',
      game.assignedCars,
      game.isGameStarted,
      game.isCarCrash,
      game.offenderBeforeMove,
      game.initialTimerInSec,
      game.endTimeOfTurn,
    );
  });

  socket.on('game:start', (initialTimerInSec) => {
    const { gameId } = socket.handshake.auth;
    const game = games[gameId];

    game.assignedCars[0].hasTurn = true;
    game.isGameStarted = true;
    game.initialTimerInSec = initialTimerInSec;
    game.endTimeOfTurn = calcEndTimeOfTurn(game.initialTimerInSec);
    game.turnTransfer = scheduler.scheduleJob(game.endTimeOfTurn, function() {
      const isSomebodyOnline = game.assignedCars.some(c => c.isOnline);

      if (!isSomebodyOnline) {
        game.turnTransfer.cancel();
        delete games[gameId];
        return;
      }
      let copyOfCars = JSON.parse(JSON.stringify(game.assignedCars));
      const indexOfCarWithTurn = copyOfCars.findIndex(c => c.hasTurn);

      if (indexOfCarWithTurn === -1) {
        game.turnTransfer.cancel();
        delete games[gameId];
        return;
      }
      const carWithTurn = copyOfCars[indexOfCarWithTurn];
      if (carWithTurn.isOnline) {
        carWithTurn.onlineSkips += 1;
      } else {
        carWithTurn.offlineSkips += 1;
      }
      carWithTurn.hasTurn = false;
      let indexOfNextCar;

      if (carWithTurn.offlineSkips === 2 || carWithTurn.onlineSkips === 4) {
        copyOfCars.splice(indexOfCarWithTurn, 1);
        indexOfNextCar = indexOfCarWithTurn;
      } else {
        indexOfNextCar = indexOfCarWithTurn + 1;
      }

      const nextCarInRound = copyOfCars.slice(indexOfNextCar).find(c => c.penalty === 0);

      if (nextCarInRound) {
        nextCarInRound.hasTurn = true;
      } else {
        copyOfCars = copyOfCars.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
        const nextCarInNextRound = copyOfCars.find(c => c.penalty === 0);

        if (!nextCarInNextRound) {
          // setIsGameOver(true);
        } else {
          nextCarInNextRound.hasTurn = true;
        }
      }
      game.assignedCars = copyOfCars;
      game.endTimeOfTurn = calcEndTimeOfTurn(game.initialTimerInSec);
      game.turnTransfer.reschedule(game.endTimeOfTurn);

      io.to(gameId).emit(
        'car:skip-move',
        game.assignedCars,
        game.endTimeOfTurn,
      );
    });

    io.to(gameId).emit(
      'game:start',
      game.assignedCars,
      game.isGameStarted,
      game.initialTimerInSec,
      game.endTimeOfTurn,
    );
  });

  socket.on('car:change-name', (name) => {
    const { gameId, userId } = socket.handshake.auth;
    const car = games[gameId].assignedCars.find(item => item.userId === userId);

    if (car) {
      car.name = name;
    }

    io.to(gameId).emit('car:change-name', games[gameId].assignedCars);
  });

  socket.on('car:make-move', (moveType, numberOfSteps) => {
    const { gameId, userId } = socket.handshake.auth;
    const game = games[gameId];
    const carWithTurn = game.assignedCars.find(c => c.hasTurn && c.userId === userId);

    if (carWithTurn) {
      const copyOfCar = JSON.parse(JSON.stringify(carWithTurn));

      switch(moveType) {
        case Car.MoveType.goForward: {
          const shiftedCar = Car.calcStepsForward(copyOfCar, numberOfSteps);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.goToLeftLane: {
          const shiftedCar = Car.calcStepToLeftLane(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.goToRightLane: {
          const shiftedCar = Car.calcStepToRightLane(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.turnForwardLeft: {
          const shiftedCar = Car.calcTurnForwardLeft(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.turnForwardRight: {
          const shiftedCar = Car.calcTurnForwardRight(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.goOneStepBack: {
          const shiftedCar = Car.calcOneStepBack(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.turnBackLeft: {
          const shiftedCar = Car.calcTurnBackLeft(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
        case Car.MoveType.turnBackRight: {
          const shiftedCar = Car.calcTurnBackRight(copyOfCar);
          makeMove(shiftedCar, gameId);
          break;
        }
      }
    }

    io.to(gameId).emit(
      'car:make-move',
      game.assignedCars,
      game.isCarCrash,
      game.offenderBeforeMove,
      game.endTimeOfTurn,
    );
  });

  socket.on('car:handle-crash', () => {
    const { gameId, userId } = socket.handshake.auth;
    const game = games[gameId];
    const car = game.assignedCars.find(c => c.userId === game.offenderBeforeMove.userId);
    car.direction = game.offenderBeforeMove.direction;
    car.coordinate = game.offenderBeforeMove.coordinate;
    // TODO: remove car.moves?
    // TODO: pass turn to another player here???
    game.isCarCrash = false;
    game.offenderBeforeMove = null;
    game.endTimeOfTurn = calcEndTimeOfTurn(game.initialTimerInSec);
    game.turnTransfer.reschedule(game.endTimeOfTurn);

    io.to(gameId).emit(
      'car:handle-crash',
      game.assignedCars,
      game.isCarCrash,
      game.offenderBeforeMove,
      game.endTimeOfTurn,
    );
  });

  socket.on('car:skip-move', () => {
    const { gameId, userId } = socket.handshake.auth;
    const game = games[gameId];

    let copyOfCars = JSON.parse(JSON.stringify(game.assignedCars));
    const indexOfCarWithTurn = copyOfCars.findIndex(c => c.hasTurn && c.userId === userId);
    const carWithTurn = copyOfCars[indexOfCarWithTurn];
    carWithTurn.offlineSkips = 0;
    carWithTurn.onlineSkips += 1;
    carWithTurn.hasTurn = false;

    const nextCarInRound = copyOfCars.slice(indexOfCarWithTurn + 1).find(c => c.penalty === 0);

    if (nextCarInRound) {
      nextCarInRound.hasTurn = true;
    } else {
      copyOfCars = copyOfCars.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      const nextCarInNextRound = copyOfCars.find(c => c.penalty === 0);

      if (!nextCarInNextRound) {
        // setIsGameOver(true);
      } else {
        nextCarInNextRound.hasTurn = true;
      }
    }
    game.assignedCars = copyOfCars;
    game.endTimeOfTurn = calcEndTimeOfTurn(game.initialTimerInSec);
    game.turnTransfer.reschedule(game.endTimeOfTurn);

    io.to(gameId).emit(
      'car:skip-move',
      game.assignedCars,
      game.endTimeOfTurn,
    );
  });

  socket.on('car:remove-idle-player', () => {
    const { gameId, userId } = socket.handshake.auth;
    const game = games[gameId];
    let copyOfCars = JSON.parse(JSON.stringify(game.assignedCars));
    let hasRemovedCarTurn = false;
    const indexOfIdleCar = copyOfCars.findIndex(c => c.userId === userId);
    const idleCar = copyOfCars[indexOfIdleCar];

    if (idleCar) {
      copyOfCars.splice(indexOfIdleCar, 1);

      if (idleCar.isLeader) {
        if (copyOfCars.length) {
          copyOfCars[0].isLeader = true;
        } else if (game.initialCars.length) {
          game.initialCars[0].isLeader = true;
        }
      }
      if (idleCar.hasTurn) {
        hasRemovedCarTurn = true;
        const indexOfNextCar = indexOfIdleCar;
        const nextCarInRound = copyOfCars.slice(indexOfIdleCar).find(c => c.penalty === 0);

        if (nextCarInRound) {
          nextCarInRound.hasTurn = true;
        } else {
          copyOfCars = copyOfCars.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
          const nextCarInNextRound = copyOfCars.find(c => c.penalty === 0);

          if (!nextCarInNextRound) {
            // setIsGameOver(true);
          } else {
            nextCarInNextRound.hasTurn = true;
          }
        }
        game.endTimeOfTurn = calcEndTimeOfTurn(game.initialTimerInSec);
        game.turnTransfer.reschedule(game.endTimeOfTurn);
      }
      game.assignedCars = copyOfCars;
    }

    io.to(gameId).emit(
      'car:remove-idle-player',
      game.assignedCars,
      game.endTimeOfTurn,
      hasRemovedCarTurn,
    );
  });

  socket.on('disconnect', () => {
    console.log('- user disconnected', socket.id);
    const { gameId, userId } = socket.handshake.auth;
    if (gameId && userId && games[gameId]) {
      const assignedCar = games[gameId].assignedCars.find(c => c.userId === userId);
      if (assignedCar) {
        assignedCar.isOnline = false;
      }

      io.to(gameId).emit('game:disconnect', games[gameId].assignedCars);
    }
  });
});

httpServer.listen(SERVER_PORT, () => {
  console.log(`Listening on ${SERVER_PORT}`);
});
