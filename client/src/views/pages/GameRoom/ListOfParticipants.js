import { Fragment, useContext } from 'react';
import AppContext from '../../../context/AppContext';

import styles from '../../../styles/pages/GameRoom/ListOfParticipants.module.css';

function ListOfParticipants({ socket, userId }) {
  const context = useContext(AppContext);
  const { cars, setCars } = context;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.item1} />
        <div className={styles.item2}>Car</div>
        <div className={styles.item3}>Name</div>
        <div className={styles.item4}>Penalty</div>
        {cars.map((car, idx) => {
          const styleOfTurn = car.penalty ? styles.playerPenalty
            : car.isTurn ? styles.playerTurn : '';
          const isDisabled = userId !== car.userId;

          return (
            <Fragment key={idx}>
              <div className={styles.item1}>
                {car.isOnline ?
                  <div className={styles.online} /> : <div className={styles.offline} />
                }
              </div>
              <div className={[styles.item2, styleOfTurn].join(' ')}>
                {car.number}
              </div>
              <input
                type="text"
                className={[styles.item3, styleOfTurn].join(' ')}
                value={car.name}
                onChange={(event => {
                  const copy = [...cars];
                  const { value } = event.target;
                  copy[car.index] = { ...copy[car.index], name: value };
                  setCars(copy);
                  socket.emit('car:change-name', value);
                })}
                disabled={isDisabled}
              />
              <div className={[styles.item4, styleOfTurn].join(' ')}>
                {car.penalty ? car.penalty : ''}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ListOfParticipants;
