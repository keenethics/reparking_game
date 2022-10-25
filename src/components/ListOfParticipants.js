import { Fragment } from 'react';

import styles from '../styles/ListOfParticipants.module.css';

function ListOfParticipants({ cars, setCars }) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.item1}>Car</div>
        <div className={styles.item2}>Name</div>
        <div className={styles.item3}>Penalty</div>
        {cars.map((car, idx) => {
          const styleOfTurn = car.penalty ? styles.playerPenalty
            : car.isTurn ? styles.playerTurn : '';

          return (
            <Fragment key={idx}>
              <div className={[styles.item1, styleOfTurn].join(' ')}>
                {car.number}
              </div>
              <input
                type="text"
                className={[styles.item2, styleOfTurn].join(' ')}
                value={car.name}
                onChange={(event => {
                  const copy = [...cars];
                  copy[car.index] = { ...copy[car.index], name: event.target.value };
                  setCars(copy);
                })}
              />
              <div className={[styles.item3, styleOfTurn].join(' ')}>
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
