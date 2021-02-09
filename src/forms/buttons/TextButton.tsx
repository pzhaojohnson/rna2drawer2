import * as React from 'react';
import styles from './TextButton.css';

interface Props {
  text: string;
  onClick: () => void;
  fontSize?: string;
  color?: string;
}

export function TextButton(props: Props) {
  return (
    <p
      className={styles.textButton}
      onClick={props.onClick}
      style={{
        fontSize: props.fontSize,
        color: props.color,
      }}
    >
      {props.text}
    </p>
  );
}
