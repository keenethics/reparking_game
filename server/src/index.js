import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import rooms from './store/rooms';
import initialDataOfCars from './helpers/initialDataOfCars';
import Car from '../../shared/Car'; // TODO: refactor
import Game from '../../shared/Game'; // TODO: refactor

const expressApp = express();
const httpServer = http.createServer(expressApp);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const PORT = 8080; // TODO: env

// TODO: refactor
const makeMove = (shiftedCar, roomId) => {
  const assignedCars = rooms[roomId].assignedCars;
  let copyOfCars = JSON.parse(JSON.stringify(assignedCars));
  shiftedCar.isTurn = false;
  copyOfCars[shiftedCar.index] = { ...shiftedCar };

  // calculate cars positions on cells
  copyOfCars = copyOfCars.map(c => {
    let rowIndex;
    let colIndex;

    if (shiftedCar.index === c.index) {
      return c;
    }

    switch(c.direction) {
      case Car.Direction.up:
      case Car.Direction.down:
        rowIndex = c.coordinate.top / Game.cellHeight;
        colIndex = c.coordinate.left / Game.cellWidth;
        return {
          ...c,
          onCells: [
            `row${rowIndex + 1},col${colIndex + 1}`,
            `row${rowIndex + 2},col${colIndex + 1}`,
          ],
        };
      case Car.Direction.left:
      case Car.Direction.right:
        rowIndex = (c.coordinate.top + Car.width / 2) / Game.cellHeight;
        colIndex = (c.coordinate.left - Car.height / 4) / Game.cellWidth;
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
      if (shiftedCar.index !== c.index && c.onCells.includes(move)) {
        isCrash = true;
        offender = shiftedCar;
        victim = c;
      }

      return isCrash;
    });

    return isCrash;
  });

  if (isCrash) {
    copyOfCars[offender.index] = { ...offender, penalty: offender.penalty + 2 };
    copyOfCars[victim.index] = { ...victim, penalty: victim.penalty + 1 };
  }

  /* ******** pass a turn ********* */
  const nextCarInRound = copyOfCars.slice(shiftedCar.index + 1).find(c => c.penalty === 0);

  if (nextCarInRound) {
    copyOfCars[nextCarInRound.index] = { ...nextCarInRound, isTurn: true };
  } else {
    copyOfCars = copyOfCars.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
    const nextCarInNextRound = copyOfCars.find(c => c.penalty === 0);

    if (!nextCarInNextRound) {
      // setIsGameOver(true);
    } else {
      copyOfCars[nextCarInNextRound.index] = { ...nextCarInNextRound, isTurn: true };
    }
  }
  /* ******************* */

  if (isCrash) {
    rooms[roomId].isCarCrash = true;
    const carBeforeMove = rooms[roomId].assignedCars[shiftedCar.index];
    rooms[roomId].offenderBeforeMove = carBeforeMove;
    rooms[roomId].assignedCars = copyOfCars;
    // setIsTimerStopped(true); // TODO
  } else {
    rooms[roomId].assignedCars = copyOfCars;
    // setTimer({ v: initialTimer.v }); // TODO
  }

  // TODO: setBoardCells boxshadow: none
};

io.use((socket, next) => {
  const { roomId } = socket.handshake.auth;

  if (roomId) {
    const room = rooms[roomId];

    if (!room) {
      return next(new Error('Game does not exist'));
    }
    // TODO: add contitions for joining the room
    /*
    if (room.assignedCars.length === 1) {
      return next(new Error('Game is full of players'));
    }
    */
  }

  next();
});

io.on('connection', (socket) => {
  console.log('+ user connected', socket.id, socket.handshake);

  socket.on('game:create', () => {
    // TODO: test on client
    // throw new Error('abc');
    const randomRoomId = uuidv4();
    rooms[randomRoomId] = {
      initialCars: initialDataOfCars,
      assignedCars: [],
      isGameStarted: false,
      isCarCrash: false,
      offenderBeforeMove: null,
      timer: 30,
    };
    const gameUrl = `/game/${randomRoomId}`;

    console.log('game:create: ', rooms); // TODO: check socket.rooms

    socket.emit('game:create', gameUrl);
  });

  socket.on('game:join', () => {
    console.log('game:join - handshake', socket.handshake);
    const { roomId, userId } = socket.handshake.auth;
    // TODO: throw error if room doesn't exist
    socket.join(roomId);
    const room = rooms[roomId];
    const assignedCar = room.assignedCars.find(item => item.userId === userId);
    if (!assignedCar) {
      rooms[roomId].assignedCars.push(
        {
          ...room.initialCars[room.assignedCars.length],
          isOnline: true,
          userId,
          isLeader: rooms[roomId].assignedCars.length === 0 ? true : false,
        },
      );
    } else {
      assignedCar.isOnline = true;
    }

    console.log('game:join - rooms: ', rooms);

    io.to(roomId).emit(
      'game:join',
      rooms[roomId].assignedCars,
      rooms[roomId].isGameStarted,
      rooms[roomId].timer,
    );
  });

  socket.on('game:start', (timer) => {
    const { roomId, userId } = socket.handshake.auth;

    rooms[roomId].timer = timer;
    rooms[roomId].isGameStarted = true;

    io.to(roomId).emit('game:start', rooms[roomId].isGameStarted, rooms[roomId].timer);
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
    const selectedCar = rooms[roomId].assignedCars.find(c => c.userId === userId);

    if (selectedCar) {
      const copyOfCar = JSON.parse(JSON.stringify(selectedCar));

      switch(moveType) {
        case Car.MoveType.goForward: {
          const shiftedCar = Car.calcStepsForward(copyOfCar, numberOfSteps);
          makeMove(shiftedCar, roomId);
          break;
        }
        case Car.MoveType.goOneStepBack: {
          const shiftedCar = Car.calcOneStepBack(copyOfCar);
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
      rooms[roomId].assignedCars,
      rooms[roomId].isCarCrash,
      rooms[roomId].offenderBeforeMove,
      rooms[roomId].timer,
    );
  });

  socket.on('car:crash', () => {
    const { roomId, userId } = socket.handshake.auth;
    const room = rooms[roomId];
    let car = room.assignedCars[room.offenderBeforeMove.index];
    car = {
      ...car,
      direction: room.offenderBeforeMove.direction,
      coordinate: room.offenderBeforeMove.coordinate,
    };
    // TODO: remove car.moves?
    room.assignedCars[car.index] = car;
    room.isCarCrash = false;
    room.offenderBeforeMove = null;
    // setIsTimerStopped(false);
    // setTimer({ v: initialTimer });

    io.to(roomId).emit(
      'car:crash',
      room.assignedCars,
      room.isCarCrash,
      room.offenderBeforeMove,
      room.timer,
    );
  });

  socket.on('car:skip-move', () => {
    const { roomId, userId } = socket.handshake.auth;

    let copyOfCars = JSON.parse(JSON.stringify(rooms[roomId].assignedCars));
    const selectedCar = copyOfCars.find(c => c.userId === userId);
    copyOfCars[selectedCar.index] = { ...selectedCar, isTurn: false };

    const nextCarInRound = copyOfCars.slice(selectedCar.index + 1).find(c => c.penalty === 0);

    if (nextCarInRound) {
      copyOfCars[nextCarInRound.index] = { ...nextCarInRound, isTurn: true };
    } else {
      copyOfCars = copyOfCars.map(c => ({ ...c, penalty: c.penalty > 0 ? c.penalty - 1 : 0 }));
      const nextCarInNextRound = copyOfCars.find(c => c.penalty === 0);

      if (!nextCarInNextRound) {
        // setIsGameOver(true);
      } else {
        copyOfCars[nextCarInNextRound.index] = { ...nextCarInNextRound, isTurn: true };
      }
    }
    rooms[roomId].assignedCars = copyOfCars;

    // flushSync(() => setIsStopped(true)); // TODO: fallback
    // setTimer({ v: initialTimer.v }); // TODO: v0
    // setIsStopped(false); // TODO: fallback

    io.to(roomId).emit('car:skip-move', rooms[roomId].assignedCars, rooms[roomId].timer);
  });

  socket.on('disconnect', () => {
    console.log('- user disconnected', socket.id);
    const { roomId, userId } = socket.handshake.auth;
    if (roomId && userId) {
      const assignedCar = rooms[roomId].assignedCars.find(item => item.userId === userId);
      if (assignedCar) {
        assignedCar.isOnline = false;
      }
      // TODO: remove car after some period of time
      io.to(roomId).emit('game:disconnect', rooms[roomId].assignedCars);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
