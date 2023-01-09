import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { Game } from '@reparking_game/shared';
import Spinner from '../../components/Spinner';
import styles from '../../../styles/pages/GameMenu/GameMenu.module.css';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

function GameMenu () {
  const [gameUrls, setGameUrls] = useState([]);
  const [gameMode, setGameMode] = useState(Game.Mode.solo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const changeGameMode = (event) => setGameMode(event.target.value);

  const createGame = async () => {
    try {
      const createGameUrl = '/api/game/create';
      setIsLoading(true);
      const reqBody = { mode: gameMode };
      const response = await fetch(
        process.env.NODE_ENV === 'development' ? REACT_APP_SERVER_URL + createGameUrl : createGameUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(reqBody),
        },
      );
      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error.message);
      }
      setGameUrls(resData.urls);
      setIsLoading(false);
      setError(null);
    } catch(err) {
      console.error(err);
      setIsLoading(false);
      setError(err);
    }
  };

  const goToGame = (url) => {
    navigate(url);
  };

  const copyToClipboard = (event, url) => {
    navigator.clipboard.writeText(url);
    event.target.innerHTML = '&#9989';
  };

  const setBackClipboardIcon = (event) => {
    event.target.innerHTML = '&#128203';
  };

  const renderCreationSection = () => {
    return (
      <>
        <button className={styles.createGameBtn} onClick={createGame}>Create Game</button>
        <div className={styles.radioContainer}>
          <span className={styles.radioGroupTitle}>Modes:</span>
          {Object.keys(Game.Mode).map(key => {
            const value = Game.Mode[key];
            return (
              <Fragment key={key}>
                <input
                  className={styles.radioInput}
                  type="radio"
                  id={value}
                  name="mode"
                  value={value}
                  checked={value === gameMode}
                  onChange={changeGameMode}
                />
                <label className={styles.radioLabel} htmlFor={value}>{value}</label>
              </Fragment>
            );
          })}
        </div>
      </>
    );
  };

  const renderNewGameSection = () => {
    return gameUrls.length ? (
      <div className={styles.gameSection}>
        <div className={styles.gameSectionTitle}>New Game:</div>
        <div className={styles.gameSectionBody}>
          {gameUrls.map((url, index, array) => (
            <div key={url} className={styles.urlWrapper}>
              <button className={styles.linkBtn} onClick={() => goToGame(url)}>
                {array.length === 1 ? 'Solo' : `Team ${index + 1}`}
              </button>
              <button
                className={styles.clipboardBtn}
                onClick={(event) => copyToClipboard(event, `${REACT_APP_SERVER_URL}${url}`)}
                onMouseOut={setBackClipboardIcon}
              >
                &#128203;
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderLastGameSection = () => {
    const gameId = localStorage.getItem('reparking-game-gameId');
    const teamN = localStorage.getItem('reparking-game-teamN');

    return gameId && teamN ? (
      <div className={styles.gameSection}>
        <div className={styles.gameSectionTitle}>Last Game:</div>
        <div className={styles.urlWrapper}>
          <button className={styles.linkBtn} onClick={() => goToGame(`/game/${gameId}/team/${teamN}`)}>
            {`${REACT_APP_SERVER_URL}/game/${gameId}/team/${teamN}`}
          </button>
          <button
            className={styles.clipboardBtn}
            onClick={(event) => copyToClipboard(event, `${REACT_APP_SERVER_URL}/game/${gameId}/team/${teamN}`)}
            onMouseOut={setBackClipboardIcon}
          >
            &#128203;
          </button>
        </div>
      </div>
    ) : null;
  };

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      {renderCreationSection()}
      {error ? (
        <div className={styles.error}>Sorry, an unexpected error has occurred.</div>
        ) : (
        renderNewGameSection()
      )}
      {renderLastGameSection()}
    </div>
  );
}

export default GameMenu;
