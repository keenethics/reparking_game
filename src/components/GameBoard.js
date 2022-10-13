import Car from './Car.js';
import Information from './Information.js';

// import board size from helpers
import styles from '../styles/GameBoard.module.css'

function GameBoard({ car }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {new Array(64).fill().map((item, idx) => <div key={idx} className={styles.cell} />)}
        <Car car={car} />
      </div>
      <Information />
    </div>
  );
}

export default GameBoard;
