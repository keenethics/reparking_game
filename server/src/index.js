import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import scheduler from 'node-schedule';

import rooms from './store/rooms.js';
import initialDataOfCars from './helpers/initialDataOfCars.js';
import { Game, Car } from '@reparking_game/shared';

const SERVER_PORT = process.env.SERVER_PORT;
const expressApp = express();

if (process.env.NODE_ENV === 'production') {
  expressApp.use(express.static(path.join(process.cwd(), 'client_build')));
  expressApp.get('/*', function (req, res) {
    res.sendFile(path.join(process.cwd(), 'client_build', 'index.html'));
  });
}
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
const makeMove = (shiftedCar, roomId) => {
  const room = rooms[roomId];
  let copyOfCars = JSON.parse(JSON.stringify(room.assignedCars));
  shiftedCar.hasTurn = false;
  shiftedCar.offlineSkips = 0;
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
    room.isCarCrash = true;
    room.offenderBeforeMove = room.assignedCars[indexOfShiftedCar];
    room.assignedCars = copyOfCars;
    room.turnTransfer.cancel();
  } else {
    room.assignedCars = copyOfCars;
    room.endTimeOfTurn = calcEndTimeOfTurn(room.initialTimerInSec);
    room.turnTransfer.reschedule(room.endTimeOfTurn);
  }
};

io.use((socket, next) => {
  const { roomId, userId } = socket.handshake.auth;

  if (roomId) {
    const room = rooms[roomId];

    if (!room) {
      return next(new Error('Game does not exist'));
    }
    const carOfPlayer = room.assignedCars.find(c => c.userId === userId);

    if (!room.isGameStarted && room.assignedCars.length === 16) {
      return next(new Error('Game is full of players'));
    }
    if (room.isGameStarted && !carOfPlayer) {
      return next(new Error('Game already started'));
    }
  }

  next();
});

io.on('connection', (socket) => {
  console.log('+ user connected', socket.id, socket.handshake);

  socket.on('game:create', () => {
    const randomRoomId = uuidv4();
    rooms[randomRoomId] = {
      initialCars: initialDataOfCars,
      assignedCars: [],
      isGameStarted: false,
      isCarCrash: false,
      offenderBeforeMove: null,
      initialTimerInSec: 30,
      endTimeOfTurn: null,
      turnTransfer: null,
      createdAt: new Date(),
    };
    const msInHour = 1000 * 60 * 60;
    Object.keys(rooms).forEach((key) => {
      const room = rooms[key];

      if (!room.isGameStarted && (Date.now() - room.createdAt.getTime()) > msInHour) {
        delete rooms[key];
      }
    });
    const gameUrl = `/game/${randomRoomId}`;

    console.log('game:create: ', rooms); // TODO: check socket.rooms

    socket.emit('game:create', gameUrl);
  });

  socket.on('game:join', () => {
    console.log('game:join - handshake', socket.handshake);

    const { roomId, userId } = socket.handshake.auth;
    const room = rooms[roomId];
    socket.join(roomId);
    const assignedCar = room.assignedCars.find(item => item.userId === userId);

    if (!assignedCar) {
      room.assignedCars.push(
        {
          ...room.initialCars[room.assignedCars.length],
          userId,
          isLeader: room.assignedCars.length === 0 ? true : false,
          isOnline: true,
        },
      );
    } else {
      assignedCar.isOnline = true;
    }

    console.log('game:join - rooms: ', rooms);

    io.to(roomId).emit(
      'game:join',
      room.assignedCars,
      room.isGameStarted,
      room.isCarCrash,
      room.offenderBeforeMove,
      room.initialTimerInSec,
      room.endTimeOfTurn,
    );
  });

  socket.on('game:start', (initialTimerInSec) => {
    const { roomId } = socket.handshake.auth;
    const room = rooms[roomId];

    room.assignedCars[0].hasTurn = true;
    room.isGameStarted = true;
    room.initialTimerInSec = initialTimerInSec;
    room.endTimeOfTurn = calcEndTimeOfTurn(room.initialTimerInSec);
    room.turnTransfer = scheduler.scheduleJob(room.endTimeOfTurn, function() {
      const isSomebodyOnline = room.assignedCars.some(c => c.isOnline);

      if (!isSomebodyOnline) {
        room.turnTransfer.cancel();
        delete rooms[roomId];
        return;
      }
      let copyOfCars = JSON.parse(JSON.stringify(room.assignedCars));
      const indexOfCarWithTurn = copyOfCars.findIndex(c => c.hasTurn);

      if (indexOfCarWithTurn === -1) {
        room.turnTransfer.cancel();
        delete rooms[roomId];
        return;
      }
      const carWithTurn = copyOfCars[indexOfCarWithTurn];
      carWithTurn.hasTurn = false;
      carWithTurn.offlineSkips = carWithTurn.isOnline ? carWithTurn.offlineSkips : carWithTurn.offlineSkips + 1;
      let indexOfNextCar;

      if (carWithTurn.offlineSkips === 2) {
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
      room.assignedCars = copyOfCars;
      room.endTimeOfTurn = calcEndTimeOfTurn(room.initialTimerInSec);
      room.turnTransfer.reschedule(room.endTimeOfTurn);

      io.to(roomId).emit(
        'car:skip-move',
        room.assignedCars,
        room.endTimeOfTurn,
      );
    });

    io.to(roomId).emit(
      'game:start',
      room.assignedCars,
      room.isGameStarted,
      room.initialTimerInSec,
      room.endTimeOfTurn,
    );
  });

  socket.on('car:change-name', (name) => {
    const { roomId, userId } = socket.handshake.auth;
    const car = rooms[roomId].assignedCars.find(item => item.userId === userId);

    if (car) {
      car.name = name;
    }

    io.to(roomId).emit('car:change-name', rooms[roomId].assignedCars);
  });

  socket.on('car:make-move', (moveType, numberOfSteps) => {
    const { roomId, userId } = socket.handshake.auth;
    const room = rooms[roomId];
    const carWithTurn = room.assignedCars.find(c => c.hasTurn && c.userId === userId);

    if (carWithTurn) {
      const copyOfCar = JSON.parse(JSON.stringify(carWithTurn));

      switch(moveType) {
        case Car.MoveType.goForward: {
          const shiftedCar = Car.calcStepsForward(copyOfCar, numberOfSteps);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.goToLeftLane: {
          const shiftedCar = Car.calcStepToLeftLane(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.goToRightLane: {
          const shiftedCar = Car.calcStepToRightLane(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.turnForwardLeft: {
          const shiftedCar = Car.calcTurnForwardLeft(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.turnForwardRight: {
          const shiftedCar = Car.calcTurnForwardRight(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.goOneStepBack: {
          const shiftedCar = Car.calcOneStepBack(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.turnBackLeft: {
          const shiftedCar = Car.calcTurnBackLeft(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.turnBackRight: {
          const shiftedCar = Car.calcTurnBackRight(copyOfCar);
          makeMove(shiftedCar, roomId);
          break;
        }
      }
    }

    io.to(roomId).emit(
      'car:make-move',
      room.assignedCars,
      room.isCarCrash,
      room.offenderBeforeMove,
      room.endTimeOfTurn,
    );
  });

  socket.on('car:handle-crash', () => {
    const { roomId, userId } = socket.handshake.auth;
    const room = rooms[roomId];
    const car = room.assignedCars.find(c => c.userId === room.offenderBeforeMove.userId);
    car.direction = room.offenderBeforeMove.direction;
    car.coordinate = room.offenderBeforeMove.coordinate;
    // TODO: remove car.moves?
    // TODO: pass turn to another player here???
    room.isCarCrash = false;
    room.offenderBeforeMove = null;
    room.endTimeOfTurn = calcEndTimeOfTurn(room.initialTimerInSec);
    room.turnTransfer.reschedule(room.endTimeOfTurn);

    io.to(roomId).emit(
      'car:handle-crash',
      room.assignedCars,
      room.isCarCrash,
      room.offenderBeforeMove,
      room.endTimeOfTurn,
    );
  });

  socket.on('car:skip-move', () => {
    const { roomId, userId } = socket.handshake.auth;
    const room = rooms[roomId];

    let copyOfCars = JSON.parse(JSON.stringify(room.assignedCars));
    const indexOfCarWithTurn = copyOfCars.findIndex(c => c.hasTurn && c.userId === userId);
    const carWithTurn = copyOfCars[indexOfCarWithTurn];
    carWithTurn.hasTurn = false;
    carWithTurn.offlineSkips = 0;

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
    room.assignedCars = copyOfCars;
    room.endTimeOfTurn = calcEndTimeOfTurn(room.initialTimerInSec);
    room.turnTransfer.reschedule(room.endTimeOfTurn);

    io.to(roomId).emit(
      'car:skip-move',
      room.assignedCars,
      room.endTimeOfTurn,
    );
  });

  socket.on('disconnect', () => {
    console.log('- user disconnected', socket.id);
    const { roomId, userId } = socket.handshake.auth;
    if (roomId && userId) {
      const assignedCar = rooms[roomId].assignedCars.find(c => c.userId === userId);
      if (assignedCar) {
        assignedCar.isOnline = false;
      }

      io.to(roomId).emit('game:disconnect', rooms[roomId].assignedCars);
    }
  });
});

httpServer.listen(SERVER_PORT, () => {
  console.log(`Listening on ${SERVER_PORT}`);
});
