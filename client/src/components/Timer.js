import { useEffect } from 'react';

import styles from '../styles/Timer.module.css';

function Timer ({
  initialTimer,
  setInitialTimer,
  timer,
  setTimer,
  isTimerStopped,
  setIsTimerStopped,
  goToNextCar,
}) {
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
    setIsTimerStopped(!isTimerStopped);
  };

  const handleTimerInput = (e) => {
    const { value } = e.target;

    if (value.length === 0) {
      setInitialTimer({ v: '' });
      setTimer({ v: '' });
      setIsTimerStopped(true);
      return;
    }
    if (/^[0-9]{1,2}$/.test(value)) {
      const parsedInt = Number.parseInt(value);
      setInitialTimer({ v: parsedInt });
      setTimer({ v: parsedInt });
      setIsTimerStopped(true);
    }
  };

  useEffect(() => {
    let timerId;

    if (!isTimerStopped) {
        timerId = setTimeout(() => {
        //timerId = setInterval(() => {
          if (timer.v === 0) {
            goToNextCar();
            setTimer({ v: initialTimer.v });
          } else {
            setTimer(prevTimer => ({ v: prevTimer.v - 1 }));
          }
        }, 1000);

    }

    return () => {
      clearTimeout(timerId);
    //  clearInterval(timerId);
    };
  }, [isTimerStopped, timer]);

  return (
    <div className={styles.container}>
      <input
        className={styles.timerInput}
        type="text"
        value={timer.v}
        disabled={false}
        onChange={handleTimerInput}
      />
      <button
        className={styles.timerButton}
        onClick={handleTimerButton}
      >
        {isTimerStopped ? <span>&#9654;</span>: <span>&#9726;</span>}
      </button>
    </div>
  );
}

export default Timer;
