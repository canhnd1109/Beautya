import styles from './UnauthorizedPage.module.css';

const UnauthorizedPage = () => {
    return (
        <div className={styles['not-found-container']}>
            <h1 className={styles['h1']}>Unauthorized Access</h1>
            <p className={styles['p']}>Oops! Something not correct.</p>
            <p className={styles['p']}>You don't have permission to access this page.</p>
        </div>
    );
};

export default UnauthorizedPage;
