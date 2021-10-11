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
        setChecked(!checked);

        // give time to rerender in case the change event callback unmounts the checkbox
        // (otherwise, React might complain about a memory leak)
        setTimeout(
          () => props.onChange({ target: { checked: !checked } }),
          75,
        );
      }}
    >
      <div className={styles.checkContainer} >
        {!checked ? null : (
          <img
            src={check}
            alt='Check'
            className={styles.check}
          />
        )}
      </div>
    </div>
  );
}
