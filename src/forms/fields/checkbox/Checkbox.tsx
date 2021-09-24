import * as React from 'react';
import { useState } from 'react';
import check from './check.svg';
import styles from './Checkbox.css';

export type ChangeEvent = {
  target: {
    checked: boolean;
  }
}

export type Props = {
  checked: boolean;
  onChange: (event: ChangeEvent) => void;
}

export function Checkbox(props: Props) {
  let [checked, setChecked] = useState(props.checked);
  return (
    <div
      className={`${styles.checkbox} ${checked ? styles.checked : styles.unchecked}`}
      onClick={() => {
        props.onChange({ target: { checked: !checked } });
        setChecked(!checked);
      }}
    >
      {!checked ? null : (
        <img
          src={check}
          alt='Check'
          style={{ width: '10px' }}
        />
      )}
    </div>
  );
}
