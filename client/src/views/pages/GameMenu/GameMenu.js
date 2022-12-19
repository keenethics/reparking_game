import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import styles from '../../../styles/pages/GameMenu/GameMenu.module.css';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io(REACT_APP_SERVER_URL);

function GameMenu () {
  const [gameUrl, setGameUrl] = useState('');
  const navigate = useNavigate();
  const clipboardBtn = useRef();

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

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(`${REACT_APP_SERVER_URL}${gameUrl}`);
    clipboardBtn.current.innerHTML = '&#9989';
  };

  const changeToClipboardIcon = () => {
    clipboardBtn.current.innerHTML = '&#128203';
  };

  return (
    <div className={styles.container}>
      <button className={styles.createGameBtn} onClick={createGame}>Create Game</button>
      {gameUrl && (
        <div className={styles.urlWrapper}>
          <button className={styles.linkBtn} onClick={goToGame}>
            {`${REACT_APP_SERVER_URL}${gameUrl}`}
          </button>
          <button
            ref={clipboardBtn}
            className={styles.clipboardBtn}
            onClick={copyTextToClipboard}
            onMouseOut={changeToClipboardIcon}
          >
              &#128203;
          </button>
        </div>
      )}
    </div>
  );
}

export default GameMenu;
