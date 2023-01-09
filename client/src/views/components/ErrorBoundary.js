import { useRouteError } from 'react-router-dom';

import styles from '../../styles/components/ErrorBoundary.module.css';

function ErrorBoundary () {
  const error = useRouteError();
  console.error(error);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Error!</div>
      <div className={styles.content}>{error.message}</div>
    </div>
  );
}

export default ErrorBoundary;
