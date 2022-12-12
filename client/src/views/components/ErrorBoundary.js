import { useRouteError } from 'react-router-dom';

import styles from '../../styles/components/ErrorBoundary.module.css';

function ErrorBoundary () {
  const error = useRouteError();

  return (
    <div className={styles.container}>
      <div className={styles.title}>Oops!</div>
      <div className={styles.content}>Sorry, an unexpected error has occurred.</div>
    </div>
  );
}

export default ErrorBoundary;
