import Car from '@reparking_game/shared/Car';

import styles from '../../../styles/pages/GameRoom/CarModel.module.css';

function CarModel({ car, cellRefOnOver }) {

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

  const onClick = (event) => {
    const carElem = event.currentTarget;
    carElem.style.zIndex = -1;
    const cell = document.elementFromPoint(event.pageX, event.pageY);
    carElem.style.zIndex = 'auto';
    cell.click();
  };

  const onMouseOver = (event) => {
    const carElem = event.currentTarget;
    carElem.style.zIndex = -1;
    const cell = document.elementFromPoint(event.pageX, event.pageY);
    carElem.style.zIndex = 'auto';
    const evt = new MouseEvent('mouseover', { bubbles: true, cancelable: false });
    cell.dispatchEvent(evt);
  };

  const onMouseMove = (event) => {
    const carElem = event.currentTarget;
    carElem.style.zIndex = -1;
    const cellFromPoint = document.elementFromPoint(event.pageX, event.pageY);
    carElem.style.zIndex = 'auto';

    if (cellFromPoint.id === cellRefOnOver.current.id) return;
    const mouseOut = new MouseEvent('mouseout', { bubbles: true, cancelable: false });
    cellFromPoint.dispatchEvent(mouseOut);
    const mouseOver = new MouseEvent('mouseover', { bubbles: true, cancelable: false });
    cellFromPoint.dispatchEvent(mouseOver);
  };

  return (
    <div
      className={[styles.container, styles[car.teamColor], car.hasTurn && styles.highlight].join(' ')}
      style={{
        width: `${Car.width}px`,
        height: `${Car.height}px`,
        top: `${car.coordinate.top}px`,
        left: `${car.coordinate.left}px`,
        transform: `rotate(${getCarRotation()}deg)`,
      }}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseMove={onMouseMove}
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
