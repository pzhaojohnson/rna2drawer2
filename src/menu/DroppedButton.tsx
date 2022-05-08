import * as React from 'react';
import styles from './DroppedButton.css';

function CheckMark() {
  return (
    <svg
      viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" overflow="hidden"
      style={{ height: '16px' }}
    >
      <path d="M86.1 15.8 34.9 64.2 10.3 39 1.8 47.1 34.5 80.7 43.1 72.7 94.2 24.2Z"
        fill="#333333"
      />
    </svg>
  );
}

export type Props = {
  text: string;
  onClick: () => void;
  keyBinding?: string;
  checked?: boolean;
  disabled?: boolean;
}

export function DroppedButton(props: Props) {
  return (
    <div
      className={`
        ${styles.droppedButton}
        ${props.disabled ? styles.disabled : styles.enabled}
      `}
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <p className={styles.text} >
        {props.text}
      </p>
      <div style={{ flexGrow: 1 }} />
      {!props.keyBinding ? null : (
        <p className={styles.keyBinding} >
          {props.keyBinding}
        </p>
      )}
      {props.checked ? <CheckMark /> : null}
    </div>
  );
}
