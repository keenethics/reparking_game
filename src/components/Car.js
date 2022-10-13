//import { ReactComponent as CarLogo } from '../assets/145008.svg';

// import car.size..., car step from helpers
import { CarDirection } from '../helpers';

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
    <>
    <div
      className={styles.container}
      style={{
        top: `${car.top}px`,
        left: `${car.left}px`,
        transform: `rotate(${calcRotationDegrees(car.direction)}deg)`,
      }}
    >
      <div className={styles.number}>13</div>
    </div>
    </>
  );
}

export default Car;
