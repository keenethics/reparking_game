import styles from '../../../styles/pages/GameRoom/IdleTimerToast.module.css';

function IdleTimerToast({ isShown, resetIdleTimer }) {
  return isShown ? (
    <div className={styles.container}>
      <div className={styles.question}>Are you here?</div>
      <button
        className={styles.btn}
        onClick={resetIdleTimer}
      >
        Yes
      </button>
    </div>
  ) : null;
}

export default IdleTimerToast;
