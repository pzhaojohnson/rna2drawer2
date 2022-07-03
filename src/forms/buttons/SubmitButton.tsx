import * as React from 'react';
import styles from './SubmitButton.css';

export type Props = {
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export function SubmitButton(props: Props) {
  return (
    <button
      className={styles.submitButton}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
}
