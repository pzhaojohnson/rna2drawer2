import * as React from 'react';
import styles from './DroppedButton.css';
import checkMark from './checkMark.svg';

function CheckMark() {
  return (
    <img
      src={checkMark}
      alt='Check Mark'
      style={{ height: '16px' }}
    />
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
        unselectable
      `}
      onClick={() => {
        if (!props.disabled) {
          props.onClick();
        }
      }}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <p className={`${styles.text} unselectable`} >
        {props.text}
      </p>
      <div style={{ flexGrow: 1 }} />
      {!props.keyBinding ? null : (
        <p className={`${styles.keyBinding} unselectable`} >
          {props.keyBinding}
        </p>
      )}
      {props.checked ? <CheckMark /> : null}
    </div>
  );
}
