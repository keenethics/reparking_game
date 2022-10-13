import styles from '../styles/ParticipantList.module.css';

function ParticipantList() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Participants:</div>
      <div className={styles.playerPenalty}>1 - Player1 (penalty 2 turns)</div>
      <div>2 - Player2</div>
      <div className={styles.playerTurn}>3 - Player3</div>
      <div>4 - Player4</div>
    </div>
  );
}

export default ParticipantList;
