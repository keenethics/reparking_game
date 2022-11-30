import { useEffect } from 'react';

import styles from '../../../styles/pages/GameRoom/Timer.module.css';

function Timer ({
  userId,
  socket,
  isGameStarted,
  isCarCrash,
  initialTimer,
  // setInitialTimer,
  timer,
  setTimer,
  isTimerStopped,
  setIsTimerStopped,
  cars,
}) {
  const myCar = cars.find(c => c.userId === userId);

  const handleTimerButton = () => {
    if (timer.v === '') {
      return;
    }
    /*
    if (isStopped) {
      flushSync(() =>
        setTimerId(
          setInterval(() => {
            if (timer === 0) {
              setTimer(initialTimer);
            } else {
              setTimer(prevTimer => prevTimer - 1);
            }
          }, 1000)
        )
      )
    } else {
      clearInterval(timerId);
    }
    */
    // setIsTimerStopped(!isTimerStopped); // TODO: v0
    socket.emit('game:start', timer.v)
  };

  const handleTimerInput = (e) => {
    const { value } = e.target;

    if (value.length === 0) {
      // setInitialTimer({ v: '' }); // TODO: v0
      setTimer({ v: '' });
      // setIsTimerStopped(true); // TODO: v0
      return;
    }
    if (/^[0-9]{1,2}$/.test(value)) {
      const parsedInt = Number.parseInt(value);
      // setInitialTimer({ v: parsedInt }); // TODO: v0
      setTimer({ v: parsedInt });
      // setIsTimerStopped(true); // TODO: v0
    }
  };

  useEffect(() => {
    let timerId;

    // if (!isTimerStopped) { // TODO: v0
    if (isGameStarted && !isCarCrash) {
        timerId = setTimeout(() => {
          if (timer.v === 0 && myCar?.hasTurn) {
            // goToNextCar(); // TODO: v0
            // setTimer({ v: initialTimer.v }); // TODO: v0
            socket.emit('car:skip-move');
          } else {
            setTimer(prevTimer => ({ v: prevTimer.v - 1 }));
          }
        }, 1000);

    }

    return () => {
      clearTimeout(timerId);
    };
  // }, [isTimerStopped, timer]); TODO: v0
  }, [isGameStarted, isCarCrash, timer]);

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressValue}
          style={{ width: `${timer.v / initialTimer.v * 100}%` }}
        ></div>

        <input
          className={styles.timerInput}
          type="text"
          value={timer.v}
          disabled={isGameStarted || !myCar?.isLeader}
          onChange={handleTimerInput}
        />
        {!isGameStarted && myCar?.isLeader && (
          <button
            className={styles.timerButton}
            onClick={handleTimerButton}
          >
            {isTimerStopped ? <span>&#9654;</span>: <span>&#9726;</span>}
          </button>
        )}
      </div>
    </div>
  );
}

export default Timer;
