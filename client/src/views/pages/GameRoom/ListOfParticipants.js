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
          <div className={[styles.col3, styles.tHead].join(' ')}>
            <div className={styles.item1}>Car</div>
            <div className={styles.item2}>Name</div>
            <div className={styles.item3}>Penalty</div>
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
                {car.isOnline ?
                  <div className={styles.online} /> : <div className={styles.offline} />
                }
              </div>

              <div className={[styles.col3, car.hasTurn && styles.turn].join(' ')}>
                <div className={[styles.item1, car.penalty && styles.penalty].join(' ')}>
                  {car.number}
                </div>
                <input
                  type="text"
                  className={[styles.item2, car.penalty && styles.penalty].join(' ')}
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
                <div className={[styles.item3, car.penalty && styles.penalty].join(' ')}>
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
