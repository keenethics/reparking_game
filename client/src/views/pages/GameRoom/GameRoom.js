import ListOfParticipants from './ListOfParticipants';
import Board from './Board.js';
import ListOfCarActions from './ListOfCarActions';
import styles from '../../../styles/pages/GameRoom/GameRoom.module.css';

function GameRoom () {
  return (
    <div className={styles.container}>
      <ListOfParticipants />
      <Board />
      <ListOfCarActions />
    </div>
  );
}

export default GameRoom;
