import { Car } from '../../../helpers';

import styles from '../../../styles/pages/GameRoom/CarModel.module.css';

function CarModel({ car }) {
  const getCarRotation = () => {
    switch(car.direction) {
      case Car.Direction.up:
        return 0;
      case Car.Direction.down:
        return 180;
      case Car.Direction.left:
        return 270;
      case Car.Direction.right:
        return 90;
    }
  };
  const getNumberRotation = () => {
    switch(car.direction) {
      case Car.Direction.up:
        return 0;
      case Car.Direction.down:
        return 180;
      case Car.Direction.left:
        return 90;
      case Car.Direction.right:
        return 270;
    }
  };

  return (
    <div
      className={[styles.container, styles[car.teamColor], car.isTurn ? styles.highlight : ''].join(' ')}
      style={{
        width: `${Car.width}px`,
        height: `${Car.height}px`,
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

export default CarModel;
