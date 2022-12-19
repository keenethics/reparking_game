import { useEffect } from 'react';

import styles from '../../../styles/pages/GameRoom/Timer.module.css';

function Timer ({
  socket,
  myCar,
  isGameStarted,
  initialTimerInSec,
  setInitialTimerInSec,
  timer,
  setTimer,
  endTimeOfTurn,
  isCarCrash,
}) {
  const startGame = () => {
    if (initialTimerInSec === '') {
      return;
    }
    socket.emit('game:start', initialTimerInSec)
  };

  const handleTimerInput = (e) => {
    const { value } = e.target;

    if (value.length === 0) {
      setInitialTimerInSec('');
      return;
    }
    if (/^[0-9]{1,2}$/.test(value)) {
      const parsedInt = Number.parseInt(value);
      setInitialTimerInSec(parsedInt);
    }
  };

  useEffect(() => {
    /*
    if (isCarCrash) {
      setTimer(0);
      return;
    }
    */
    if (endTimeOfTurn) {
      const now = Date.now();
      const end = new Date(endTimeOfTurn).getTime();

      setTimer(Math.floor((end - now) / 1000));
    }
  }, [endTimeOfTurn]);

  useEffect(() => {
    let timerId;

    if (isGameStarted && timer !== 0 && !isCarCrash) {
      timerId = setTimeout(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [isGameStarted, timer, isCarCrash]);

  return (
    <div className={styles.container}>
      <div className={styles.progressWrapper}>
        <div
          className={styles.progressBar}
          style={{ width: `${!isGameStarted ? 100 : timer / initialTimerInSec * 100}%` }}
        ></div>

        <input
          className={styles.timerInput}
          type="text"
          value={!isGameStarted ? initialTimerInSec : timer}
          disabled={isGameStarted || !myCar?.isLeader}
          onChange={handleTimerInput}
        />
        {!isGameStarted && myCar?.isLeader && (
          <button
            className={styles.timerButton}
            onClick={startGame}
          >
            <span>&#9654;</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Timer;
