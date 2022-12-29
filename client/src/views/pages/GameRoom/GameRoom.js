import { useContext, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

import AppContext from '../../../context/AppContext';
import IdleTimerToast from './IdleTimerToast';
import ListOfParticipants from './ListOfParticipants';
import Board from './Board';
import Audio from './Audio';
import Spinner from '../../components/Spinner';
import styles from '../../../styles/pages/GameRoom/GameRoom.module.css';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
const REACT_APP_USE_WORLD_TIME = process.env.REACT_APP_USE_WORLD_TIME;
const TOAST_IDLE_TIME = 4 * 60;
const MAX_IDLE_TIME = 5 * 60;

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
  const idleTime = useRef(0);
  const [isIdleToastShown, setIsIdleToastShown] = useState(false);
  const [localTimeDeviation, setLocalTimeDeviation] = useState(0);
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

  const resetIdleTimer = () => {
    idleTime.current = 0;
    setIsIdleToastShown(false);
  }

  useEffect(() => {
    let idleTimerId;
    function runIdleTimer() {
      return setInterval(() => {
        idleTime.current += 1;

        if (idleTime.current === TOAST_IDLE_TIME) {
          setIsIdleToastShown(true);
        }
        if (idleTime.current === MAX_IDLE_TIME) {
          socket.emit('car:remove-idle-player');
          setIsIdleToastShown(false);
          clearInterval(idleTimerId);
        }
      }, 1000);
    }
    idleTimerId = runIdleTimer();
    const onMouseDown = () => resetIdleTimer();
    // const onMouseMove = () => resetIdleTimer();
    const onScroll = () => resetIdleTimer();
    const onKeyDown = () => resetIdleTimer();
    const onTouchStart = () => resetIdleTimer();
    document.addEventListener('mousedown', onMouseDown);
    // document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('scroll', onScroll);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('touchstart', onTouchStart);

    return () => {
      clearInterval(idleTimerId);
      document.removeEventListener('mousedown', onMouseDown);
      // document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  useEffect(() => {
    async function fetchWorldTimeByIp() {
      const ipifyRes = await fetch('https://api.ipify.org?format=json');
      const ipifyData = await ipifyRes.json();
      const worldtimeRes = await fetch(`https://worldtimeapi.org/api/ip/${ipifyData.ip}`);
      const worldtimeData = await worldtimeRes.json();

      setLocalTimeDeviation(new Date(worldtimeData.datetime).getTime() - Date.now());
      setIsLoading(false);
    }

    if (REACT_APP_USE_WORLD_TIME === 'true' && isFirstRendering.current) {
      fetchWorldTimeByIp();
    } else {
      setIsLoading(false);
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

    socket.on('car:remove-idle-player', (cars, endTimeOfTurn, hasRemovedCarTurn) => {
      context.setCars(cars);
      context.setEndTimeOfTurn(endTimeOfTurn);
      if (hasRemovedCarTurn) {
        playAudioOn('car:remove-idle-player', cars);
      }
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
      socket.off('car:remove-idle-player');
    };
  }, []);

  if (error) {
    throw error;
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <IdleTimerToast isShown={isIdleToastShown} resetIdleTimer={resetIdleTimer} />
      <div className={styles.container}>
        <ListOfParticipants socket={socket} userId={userId} />
        <Board socket={socket} userId={userId} localTimeDeviation={localTimeDeviation} />
        <Audio audioRef={audioRef} />
      </div>
    </>
  );
}

export default GameRoom;
