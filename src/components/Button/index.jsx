import styles from './Button.module.css';

export const Button = ({ children }) => {
  return (
    <button type="button" className={styles.button}>
      <span>{children}</span>
    </button>
  );
};
