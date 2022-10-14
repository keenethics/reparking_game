import styles from '../styles/ParticipantList.module.css';

function ParticipantList({ cars }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Participants:</div>
      {cars.map((car, idx) => (
        <div key={idx}>{car.number} - {car.name}</div>
      ))}
    </div>
  );
}

export default ParticipantList;
