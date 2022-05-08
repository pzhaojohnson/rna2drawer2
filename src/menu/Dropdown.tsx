import * as React from 'react';
import styles from './Dropdown.css';

export type Props = {
  name: string;

  // the content of the dropdown menu
  dropped: React.ReactNode;

  disabled?: boolean;
}

export function Dropdown(props: Props) {
  return (
    <div
      className={`
        ${styles.dropdown}
        ${props.disabled ? styles.disabled : styles.enabled}
      `}
    >
      <div className={styles.button} >
        <p className={styles.buttonText} >
          {props.name}
        </p>
      </div>
      {props.disabled ? null : (
        <div className={styles.droppedContainer} >
          {props.dropped}
        </div>
      )}
    </div>
  );
}
