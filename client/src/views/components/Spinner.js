import styles from '../../styles/components/Spinner.module.css';

function Spinner () {
  return (
    <div className={styles.container}>
      <div className={styles.loader} />
    </div>
  );
}

export default Spinner;
