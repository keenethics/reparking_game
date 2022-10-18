import { CarDirection, Game } from '../helpers';

import styles from '../styles/Car.module.css';

function Car({ car }) {
  const getCarRotation = () => {
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
  const getNumberRotation = () => {
    switch(car.direction) {
      case CarDirection.up:
        return 0;
      case CarDirection.down:
        return 180;
      case CarDirection.left:
        return 90;
      case CarDirection.right:
        return 270;
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
        transform: `rotate(${getCarRotation()}deg)`,
      }}
    >
      <div
        className={styles.number}
        style={{ transform: `rotate(${getNumberRotation()}deg)` }}
      >
        {car.number}
      </div>
    </div>
  );
}

export default Car;
