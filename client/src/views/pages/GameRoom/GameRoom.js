import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import AppContext from '../../../context/AppContext';
// TODO: 2 sockets outside or inside in different comps cause BUG
import socket from '../../../utils/socket';
import ListOfParticipants from './ListOfParticipants';
import Board from './Board.js';
import ListOfCarActions from './ListOfCarActions';
import styles from '../../../styles/pages/GameRoom/GameRoom.module.css';

function GameRoom () {
  const context = useContext(AppContext);
  const { gameId } = useParams();
  /*
  const [socket] = useState(() => {
    return io('http://localhost:8080', {
      auth: (cb) => {
        const roomId = gameId;
        let userId = sessionStorage.getItem(roomId);
        if (!userId) {
          userId = uuidv4();
          sessionStorage.setItem(roomId, userId);
        }
        cb({ roomId, userId });
      },
    });
  });
  */

  useEffect(() => {
    socket.on('connect', () => {
      console.log('+ connect');
      socket.emit('game:join'); // <- TODO: test it
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
