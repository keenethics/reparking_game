import { useContext, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

import AppContext from '../../../context/AppContext';
import ListOfParticipants from './ListOfParticipants';
import Board from './Board';
import Audio from './Audio';
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
  const audioRef = useRef();

  const playAudioOn = (eventName, cars) => {
    if (eventName === 'game:start') {
      audioRef.current.play();
    } else {
      const myCar = cars.find(c => c.userId === userId);
      if (myCar?.hasTurn) {
        audioRef.current.play();
      }
    }
  };

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

    socket.on('game:join', (cars, isGameStarted, isCarCrash, offenderBeforeMove, initialTimerInSec, endTimeOfTurn) => {
      context.setCars(cars);
      context.setIsGameStarted(isGameStarted);
      context.setIsCarCrash(isCarCrash);
      context.setOffenderBeforeMove(offenderBeforeMove);
      context.setInitialTimerInSec(initialTimerInSec);
      context.setEndTimeOfTurn(endTimeOfTurn);
    });

    socket.on('game:start', (cars, isGameStarted, initialTimerInSec, endTimeOfTurn) => {
      context.setCars(cars);
      context.setIsGameStarted(isGameStarted);
      context.setInitialTimerInSec(initialTimerInSec);
      context.setEndTimeOfTurn(endTimeOfTurn);
      playAudioOn('game:start');
    });

    socket.on('game:disconnect', (cars) => {
      context.setCars(cars);
    });

    socket.on('car:change-name', (cars) => {
      context.setCars(cars);
    });

    socket.on('car:make-move', (cars, isCarCrash, offenderBeforeMove, endTimeOfTurn) => {
      context.setCars(cars);
      context.setIsCarCrash(isCarCrash);
      context.setOffenderBeforeMove(offenderBeforeMove);
      context.setEndTimeOfTurn(endTimeOfTurn);
      playAudioOn('car:make-move', cars);
    });

    socket.on('car:handle-crash', (cars, isCarCrash, offenderBeforeMove, endTimeOfTurn) => {
      context.setCars(cars);
      context.setIsCarCrash(isCarCrash);
      context.setOffenderBeforeMove(offenderBeforeMove);
      context.setEndTimeOfTurn(endTimeOfTurn);
    });

    socket.on('car:skip-move', (cars, endTimeOfTurn) => {
      context.setCars(cars);
      context.setEndTimeOfTurn(endTimeOfTurn);
      playAudioOn('car:skip-move', cars);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      //socket.off('connect_error');
      socket.off('game:join');
      socket.off('game:start');
      socket.off('game:disconnect');
      socket.off('car:change-name');
      socket.off('car:make-move');
      socket.off('car:handle-crash');
      socket.off('car:skip-move');
    };
  }, []);

  // TODO: check react-router doc
  if (error) {
    throw error;
  }

  return (
    <div className={styles.container}>
      <ListOfParticipants socket={socket} userId={userId} />
      <Board socket={socket} userId={userId} />
      <Audio audioRef={audioRef} />
    </div>
  );
}

export default GameRoom;
