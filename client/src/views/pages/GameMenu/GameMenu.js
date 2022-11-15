import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import styles from '../../../styles/pages/GameMenu/GameMenu.module.css';

const socket = io('http://localhost:8080');

function GameMenu () {
  const [gameUrl, setGameUrl] = useState('');
  const navigate = useNavigate();

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

  const goToGame = () => {
    socket.disconnect();
    navigate(gameUrl);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={createGame}>Create Game</button>
      {gameUrl && (
        <button className={styles.link} onClick={goToGame}>
          {`http://localhost:3000${gameUrl}`}
        </button>
      )}
    </div>
  );
}

export default GameMenu;
