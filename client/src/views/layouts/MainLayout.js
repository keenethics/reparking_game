import { Outlet } from 'react-router-dom';

import styles from '../../styles/layouts/MainLayout.module.css';

function MainLayout() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
}

export default MainLayout;
