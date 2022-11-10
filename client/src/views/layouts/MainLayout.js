import styles from '../../styles/layouts/MainLayout.module.css';

function MainLayout({ children }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}

export default MainLayout;
