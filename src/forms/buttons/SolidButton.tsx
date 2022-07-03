import * as React from 'react';
import styles from './SolidButton.css';

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function SolidButton(props: Props) {
  return (
    <button
      className={styles.solidButton}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
}
