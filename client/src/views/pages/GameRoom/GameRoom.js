import { useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

import AppContext from '../../../context/AppContext';
import ListOfParticipants from './ListOfParticipants';
import Board from './Board.js';
import ListOfCarActions from './ListOfCarActions';
import styles from '../../../styles/pages/GameRoom/GameRoom.module.css';

const socket = io('http://localhost:8080', {
  auth: (cb) => {
    const splitPathname = window.location.pathname.split('/');
    const roomId = splitPathname[splitPathname.length - 1];
    let userId = sessionStorage.getItem(roomId);
    if (!userId) {
      userId = uuidv4();
      sessionStorage.setItem(roomId, userId);
    }
    cb({ roomId, userId });
  },
});

function GameRoom () {
  const context = useContext(AppContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('+ connect');
      socket.emit('game:join');
    });
    socket.on('disconnect', () => {
      console.log('- disconnect');
    });

    socket.on('game:join', (dataOfCars) => {
      context.setCars(dataOfCars);
    });

    socket.on('game:disconnect', (dataOfCars) => {
      context.setCars(dataOfCars);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('game:join');
      socket.off('game:disconnect');
    };
  }, []);

  return (
    <div className={styles.container}>
      <ListOfParticipants />
      <Board />
      <ListOfCarActions />
    </div>
  );
}

export default GameRoom;
