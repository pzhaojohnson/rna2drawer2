import * as React from 'react';
import styles from './SolidButton.css';

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export function SolidButton(props: Props): React.ReactElement {
  return (
    <button
      className={`${styles.solidButton} ${props.disabled ? styles.disabled : styles.enabled}`}
      onClick={props.disabled ? undefined : () => props.onClick()}
    >
      {props.text}
    </button>
  );
}
