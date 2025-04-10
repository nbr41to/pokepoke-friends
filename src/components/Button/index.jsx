import styles from './Button.module.css';

export const Button = ({ children, ...props }) => {
  return (
    <button type="button" className={styles.button} {...props}>
      <span>{children}</span>
    </button>
  );
};
