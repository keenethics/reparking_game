import { useContext, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

import AppContext from '../../../context/AppContext';
import ListOfParticipants from './ListOfParticipants';
import Board from './Board';
import Audio from './Audio';
import Spinner from '../../components/Spinner';
import styles from '../../../styles/pages/GameRoom/GameRoom.module.css';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

let userId;
const socket = io(REACT_APP_SERVER_URL, {
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
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRendering = useRef(true);
  const [localTimeDeviation, setLocalTimeDeviation] = useState(null);
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
    async function fetchWorldTimeByIp() {
      const ipifyRes = await fetch('https://api.ipify.org?format=json');
      const ipifyData = await ipifyRes.json();
      const worldtimeRes = await fetch(`https://worldtimeapi.org/api/ip/${ipifyData.ip}`);
      const worldtimeData = await worldtimeRes.json();

      setLocalTimeDeviation(new Date(worldtimeData.datetime).getTime() - Date.now());
      setIsLoading(false);
    }

    if (isFirstRendering.current) {
      fetchWorldTimeByIp();
    }

    return () => { isFirstRendering.current = false; }
  }, []);


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

    socket.on('connect_error', (err) => {
      setError(err);
    });

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
      socket.off('connect_error');
      socket.off('game:join');
      socket.off('game:start');
      socket.off('game:disconnect');
      socket.off('car:change-name');
      socket.off('car:make-move');
      socket.off('car:handle-crash');
      socket.off('car:skip-move');
    };
  }, []);

  if (error) {
    throw error;
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      <ListOfParticipants socket={socket} userId={userId} />
      <Board socket={socket} userId={userId} localTimeDeviation={localTimeDeviation} />
      <Audio audioRef={audioRef} />
    </div>
  );
}

export default GameRoom;
