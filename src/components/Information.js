import styles from '../styles/Information.module.css';

function Information ({ cars }) {
  const car = cars.find(c => c.isTurn);

  return (
    <div className={styles.container}>
      Car {car.number} - {car.name}
    </div>
  );
}

export default Information;
