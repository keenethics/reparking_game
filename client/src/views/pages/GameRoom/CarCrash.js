import { useContext } from 'react';

import AppContext from '../../../context/AppContext';
import styles from '../../../styles/pages/GameRoom/CarCrash.module.css';

function CarCrash ({ userId, socket }) {
  const context = useContext(AppContext);
  const { isCarCrash, offenderBeforeMove } = context;

  const handleCarCrash = () => {
    socket.emit('car:handle-crash');
  };

  return isCarCrash ? (
    <div className={styles.toastBg}>
      <div className={styles.toastCarCrash}>
        <div className={styles.toastTitle}>Car Crash</div>
        {offenderBeforeMove?.userId === userId && (
          <button className={styles.toastBtn} onClick={handleCarCrash}>OK</button>
        )}
      </div>
    </div>
  ) : null;
}

export default CarCrash;
