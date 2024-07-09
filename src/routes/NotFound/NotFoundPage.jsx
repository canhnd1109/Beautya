import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return (
        <div className={styles['not-found-container']}>
            <h1 className={styles['h1']}>404</h1>
            <p className={styles['p']}>Oops! Page not found.</p>
            <p className={styles['p']}>Looks like you've taken a wrong turn.</p>
        </div>
    );
};

export default NotFoundPage;
