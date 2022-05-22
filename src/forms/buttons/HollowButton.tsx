import * as React from 'react';
import styles from './HollowButton.css';

export type Props = {
  onClick?: () => void;

  children?: React.ReactNode;

  style?: React.CSSProperties;
};

export function HollowButton(props: Props) {
  return (
    <button
      className={styles.hollowButton}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
}
