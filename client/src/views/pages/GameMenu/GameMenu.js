import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { ReactComponent as TelegramLogo } from '../../../assets/telegram_logo.svg';
import styles from '../../../styles/pages/GameMenu/GameMenu.module.css';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
const REACT_APP_TELEGRAM_CHANNEL = process.env.REACT_APP_TELEGRAM_CHANNEL;
const socket = io(REACT_APP_SERVER_URL);

function GameMenu () {
  const [gameUrl, setGameUrl] = useState('');
  const navigate = useNavigate();
  const newGameClipboardRef = useRef();
  const lastGameClipboardRef = useRef();

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

  const goToGame = (url) => {
    navigate(url);
  };

  const copyToClipboard = (url, ref) => {
    navigator.clipboard.writeText(url);
    ref.current.innerHTML = '&#9989';
  };

  const setBackClipboardIcon = (ref) => {
    ref.current.innerHTML = '&#128203';
  };

  const renderTelegramChannel = () => {
    return REACT_APP_TELEGRAM_CHANNEL && (
      <a
        className={styles.telegramLink}
        href={REACT_APP_TELEGRAM_CHANNEL}
        target="_blank"
      >
        <TelegramLogo />
      </a>
    );
  };

  const renderNewGameSection = () => {
    return (
      <div className={styles.gameSection}>
        {gameUrl && (
          <>
            <div className={styles.sectionTitle}>New Game:</div>
            <div className={styles.urlWrapper}>
              <button className={styles.linkBtn} onClick={() => goToGame(gameUrl)}>
                {`${REACT_APP_SERVER_URL}${gameUrl}`}
              </button>
              <button
                ref={newGameClipboardRef}
                className={styles.clipboardBtn}
                onClick={() => copyToClipboard(`${REACT_APP_SERVER_URL}${gameUrl}`, newGameClipboardRef)}
                onMouseOut={() => setBackClipboardIcon(newGameClipboardRef)}
              >
                &#128203;
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLastGameSection = () => {
    const roomId = localStorage.getItem('reparking-game-roomId');

    return (
      <div className={styles.gameSection}>
        {roomId && (
          <>
            <div className={styles.sectionTitle}>Last Game:</div>
            <div className={styles.urlWrapper}>
              <button className={styles.linkBtn} onClick={() => goToGame(`/game/${roomId}`)}>
                {`${REACT_APP_SERVER_URL}/game/${roomId}`}
              </button>
              <button
                ref={lastGameClipboardRef}
                className={styles.clipboardBtn}
                onClick={() => copyToClipboard(`${REACT_APP_SERVER_URL}/game/${roomId}`, lastGameClipboardRef)}
                onMouseOut={() => setBackClipboardIcon(lastGameClipboardRef)}
              >
                &#128203;
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {renderTelegramChannel()}
      <div className={styles.container}>

        <button className={styles.createGameBtn} onClick={createGame}>Create Game</button>

        {renderNewGameSection()}
        {renderLastGameSection()}
      </div>
    </>
  );
}

export default GameMenu;
