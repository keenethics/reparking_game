import { Outlet } from 'react-router-dom';

import { ReactComponent as TelegramLogo } from '../../assets/telegram_logo.svg';
import styles from '../../styles/layouts/MainLayout.module.css';

const REACT_APP_TELEGRAM_CHANNEL = process.env.REACT_APP_TELEGRAM_CHANNEL;

function MainLayout() {
  const renderTopbar = () => {
    return (
      <div className={styles.topbar}>
        {REACT_APP_TELEGRAM_CHANNEL && (
          <a
            className={styles.telegramLink}
            href={REACT_APP_TELEGRAM_CHANNEL}
            target="_blank"
          >
            <TelegramLogo />
          </a>
        )}
        <div className={styles.gameRulesIcon}>
          i
          <div className={styles.gameRulesText}>
            <div className={styles.gameRulesTitle}>Game Rules</div>
            <dl>
              <dt># Before game start:</dt>
              <dd>- Player gets a car</dd>
              <dd>- Player can change name</dd>
              <dd>- First player can set the timer</dd>
              <dd>- First player can start the game</dd>
              <br />
              <dt># During the game:</dt>
              <dd>- Driving on highlighted cells</dd>
              <dd>- Driving into other cars</dd>
              <dd>- Skipping turn</dd>
              <br />
              <dt># End of the game:</dt>
              <dd>- One team must repark the cars with radiators to the center on the opposite side</dd>
              <br />
              <dt># Car crash:</dt>
              <dd>- Offender +2 penalties</dd>
              <dd>- Victim +1 penalty</dd>
              <br />
              <dt># Player removal:</dt>
              <dd>- Skipping 2 turns offline</dd>
              <dd>- Skipping 4 turns online</dd>
              <dd>- 5 minutes afk</dd>
              <br />
              <dt># General:</dt>
              <dd>- Player can rejoin the game</dd>
              <dd>- 16 players max</dd>
              <dd>- 2 teams</dd>
            </dl>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderTopbar()}
      <Outlet />
      <div className={styles.gameVersion}></div>
    </div>
  );
}

export default MainLayout;
