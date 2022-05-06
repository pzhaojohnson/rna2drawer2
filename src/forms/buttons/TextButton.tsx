import * as React from 'react';
import styles from './TextButton.css';

interface Props {
  text: string;
  onClick: () => void;
}

export function TextButton(props: Props) {
  return (
    <p
      className={styles.textButton}
      onClick={props.onClick}
    >
      {props.text}
    </p>
  );
}
