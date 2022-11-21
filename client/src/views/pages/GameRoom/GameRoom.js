import { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

import AppContext from '../../../context/AppContext';
import ListOfParticipants from './ListOfParticipants';
import Board from './Board.js';
import ListOfCarActions from './ListOfCarActions';
import styles from '../../../styles/pages/GameRoom/GameRoom.module.css';

let userId;

const socket = io('http://localhost:8080', {
  auth: (cb) => {
    const splitPathname = window.location.pathname.split('/');
    const roomIdInUrl = splitPathname[splitPathname.length - 1];
    let roomId = localStorage.getItem('reparking-game-roomId');
    userId = localStorage.getItem('reparking-game-userId');
    if (roomId !== roomIdInUrl) {
      roomId = roomIdInUrl;
      localStorage.setItem('reparking-game-roomId', roomId);
      userId = uuidv4();
      localStorage.setItem('reparking-game-userId', userId);
    }

    cb({ roomId, userId });
  },
});

function GameRoom () {
  const [error, setError] = useState(null);
  const context = useContext(AppContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('+ connect');
      /*
       * TODO: Improvements:
       * 1. set in auth roomId from url
       * * 2. check roomId on server in middleware
       * 3. join user on connect
       * 3.1 first connect - generate userId on server & add to room & send back & save in client storage
       * 3.2 other connects - just check
       * 4. remove socket.emit('game:join');
       */
      socket.emit('game:join');
    });

    socket.on('disconnect', () => {
      console.log('- disconnect');
    });

    // TODO: can be a cause of bug
    /*
    socket.on('connect_error', (err) => {
      console.log('connect_error');
      setError(err);
    });
    */

    socket.on('game:join', (dataOfCars) => {
      context.setCars(dataOfCars);
    });

    socket.on('game:disconnect', (dataOfCars) => {
      context.setCars(dataOfCars);
    });

    socket.on('car:change-name', (dataOfCars) => {
      context.setCars(dataOfCars);
    });

    socket.on('car:make-move', (dataOfCars, isCarCrash, offenderBeforeMove) => {
      context.setCars(dataOfCars);
      context.setIsCarCrash(isCarCrash);
      context.setOffenderBeforeMove(offenderBeforeMove);
    });

    socket.on('car:crash', (dataOfCars, isCarCrash, offenderBeforeMove) => {
      context.setCars(dataOfCars);
      context.setIsCarCrash(isCarCrash);
      context.setOffenderBeforeMove(offenderBeforeMove);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      //socket.off('connect_error');
      socket.off('game:join');
      socket.off('game:disconnect');
      socket.off('car:change-name');
      socket.off('car:make-move');
      socket.off('car:crash');
    };
  }, []);

  // TODO: check react-router doc
  if (error) {
    throw error;
  }

  return (
    <div className={styles.container}>
      <ListOfParticipants socket={socket} userId={userId} />
      <Board />
      <ListOfCarActions socket={socket} userId={userId} />
    </div>
  );
}

export default GameRoom;
