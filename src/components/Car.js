import { CarDirection, Game } from '../helpers';

import styles from '../styles/Car.module.css';

function Car({ car }) {
  const calcRotationDegrees = (carDirection) => {
    switch(car.direction) {
      case CarDirection.up:
        return 0;
      case CarDirection.down:
        return 180;
      case CarDirection.left:
        return 270;
      case CarDirection.right:
        return 90;
    }
  };

  return (
    <div
      className={[styles.container, styles[car.teamColor], car.isTurn ? styles.highlight : ''].join(' ')}
      style={{
        width: `${Game.carWidth}px`,
        height: `${Game.carHeight}px`,
        top: `${car.coordinate.top}px`,
        left: `${car.coordinate.left}px`,
        transform: `rotate(${calcRotationDegrees(car.direction)}deg)`,
      }}
    >
      <div className={styles.number}>{car.number}</div>
    </div>
  );
}

export default Car;
