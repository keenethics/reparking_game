import styles from '../styles/ParticipantList.module.css';

function ParticipantList({ cars, setCars }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Participants:</div>
      {cars.map((car, idx) => (
        <div
          key={idx}
          className={[styles.item, car.isTurn ? styles.playerTurn: ''].join(' ')}
        >
          {car.number}
          {' - '}
          <input
            type="text"
            className={`${car.isTurn ? styles.playerTurn: ''}`}
            value={car.name}
            onChange={(event => {
              const copy = [...cars];
              copy[car.index] = { ...copy[car.index], name: event.target.value };
              setCars(copy);
            })}
          />
        </div>
      ))}
    </div>
  );
}

export default ParticipantList;
