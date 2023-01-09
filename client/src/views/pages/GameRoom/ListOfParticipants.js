import { useContext } from 'react';
import AppContext from '../../../context/AppContext';

import styles from '../../../styles/pages/GameRoom/ListOfParticipants.module.css';

function ListOfParticipants({ socket, userId }) {
  const context = useContext(AppContext);
  const { cars, setCars, isGameStarted } = context;

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div className={styles.row}>
          <div className={styles.col1} />
          <div className={styles.col2} />
          <div className={[styles.col3, styles.tHead].join(' ')}>Car</div>
          <div className={[styles.col4, styles.tHead].join(' ')}>
            <div className={styles.carName}>Name</div>
            <div className={styles.carPenalty}>Penalty</div>
          </div>
        </div>
        {cars.map((car, idx) => {
          const isDisabled = isGameStarted || userId !== car.userId;

          return (
            <div className={styles.row} key={idx}>
              <div className={styles.col1}>
                {userId === car.userId ? <span className={styles.owner} /> : ''}
              </div>

              <div className={styles.col2}>
                <div className={car.isOnline ? styles.online : styles.offline} />
              </div>

              <div className={styles.col3}>
                <div className={styles.teamColor} style={{ backgroundColor: `${car.teamColor}` }}>
                  <div className={styles.carNumber}>{car.number}</div>
                </div>
              </div>

              <div className={[styles.col4, car.hasTurn && styles.turn].join(' ')}>
                <input
                  type="text"
                  className={[styles.carName, car.penalty && styles.penaltyBg].join(' ')}
                  value={car.name}
                  onChange={(event => {
                    const { value } = event.target;
                    const copyOfCars = JSON.parse(JSON.stringify(cars));
                    const myCar = copyOfCars.find(c => c.userId === userId);
                    myCar.name = value;
                    setCars(copyOfCars);
                    socket.emit('car:change-name', value);
                  })}
                  disabled={isDisabled}
                />
                <div className={[styles.carPenalty, car.penalty && styles.penaltyBg].join(' ')}>
                  {car.penalty ? car.penalty : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListOfParticipants;
