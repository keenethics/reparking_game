import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import styles from '../../../styles/pages/GameMenu/GameMenu.module.css';

function GameMenu () {
  // TODO: 2 sockets outside or inside in different comps cause BUG
  const [socket] = useState(io('http://localhost:8080'));
  const [gameUrl, setGameUrl] = useState('');

  useEffect(() => {
    socket.on('game:create', (url) => {
      setGameUrl(url);
    });

    return () => {
      socket.off('game:create');
    };
  }, []);

  const createGame = () => {
    socket.emit('game:create');
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={createGame}>Create Game</button>
      <Link className={styles.link} to={gameUrl}>{gameUrl}</Link>
    </div>
  );
}

export default GameMenu;
