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

  const renderTopbar = () => {
    return (
      <div className={styles.topbar}>
        {REACT_APP_TELEGRAM_CHANNEL && (
          <a
            className={styles.telegramLink}
            href={REACT_APP_TELEGRAM_CHANNEL}
            target="_blank"
          >
            <TelegramLogo />
          </a>
        )}
        <div className={styles.gameRulesIcon}>
          i
          <div className={styles.gameRulesText}>
            <div className={styles.gameRulesTitle}>Game Rules</div>
            <dl>
              <dt># Before game start:</dt>
              <dd>- Player gets a car</dd>
              <dd>- Player can change name</dd>
              <dd>- First player can set the timer</dd>
              <dd>- First player can start the game</dd>
              <br />
              <dt># During the game:</dt>
              <dd>- Driving on highlighted cells</dd>
              <dd>- Driving into other cars</dd>
              <dd>- Skipping turn</dd>
              <br />
              <dt># End of the game:</dt>
              <dd>- One team must repark the cars with radiators to the center on the opposite side</dd>
              <br />
              <dt># Car crash:</dt>
              <dd>- Offender +2 penalties</dd>
              <dd>- Victim +1 penalty</dd>
              <br />
              <dt># Player removal:</dt>
              <dd>- Skipping 2 turns offline</dd>
              <dd>- Skipping 4 turns online</dd>
              <dd>- 5 minutes afk</dd>
              <br />
              <dt># General:</dt>
              <dd>- Player can rejoin the game</dd>
              <dd>- 16 players max</dd>
              <dd>- 2 teams</dd>
            </dl>
          </div>
        </div>
      </div>
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
      {renderTopbar()}
      <div className={styles.container}>
        <button className={styles.createGameBtn} onClick={createGame}>Create Game</button>
        {renderNewGameSection()}
        {renderLastGameSection()}
      </div>
    </>
  );
}

export default GameMenu;
