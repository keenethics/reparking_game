import Car from './Car';
import Information from './Information';
import { Game } from '../helpers';
import styles from '../styles/GameBoard.module.css'

function GameBoard({ cars }) {
  return (
    <div className={styles.container}>
      <div
        className={styles.content}
        style={{
          width: `${Game.step * Game.numberOfPlayersInTeam}px`,
          height: `${Game.step * Game.numberOfPlayersInTeam}px`,
          gridTemplateColumns: `repeat(${Game.numberOfPlayersInTeam}, ${Game.step}px)`,
          gridTemplateRows: `repeat(${Game.numberOfPlayersInTeam}, ${Game.step}px)`,
        }}
      >
        {new Array(64).fill().map((item, idx) => (
          <div
            key={idx}
            className={styles.cell}
            style={{ width: `${Game.step}px`, height: `${Game.step}px` }}
          />
        ))}
        {cars.map((car, idx) => (
          <Car key={idx} car={car} />
        ))}
      </div>
      <Information />
    </div>
  );
}

export default GameBoard;
