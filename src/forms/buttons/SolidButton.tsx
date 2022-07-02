import * as React from 'react';
import styles from './SolidButton.css';

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function SolidButton(props: Props): React.ReactElement {
  return (
    <button
      className={`${styles.solidButton} ${props.disabled ? styles.disabled : styles.enabled}`}
      onClick={props.disabled ? undefined : () => props.onClick()}
      style={props.style}
    >
      {props.children}
    </button>
  );
}
