import * as React from 'react';
import styles from './ActionButton.css';

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton(props: Props): React.ReactElement {
  return (
    <button
      className={`${styles.actionButton} ${props.disabled ? styles.disabled : styles.enabled}`}
      onClick={props.disabled ? undefined : () => props.onClick()}
    >
      {props.text}
    </button>
  );
}
