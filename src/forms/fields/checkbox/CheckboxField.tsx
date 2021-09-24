import * as React from 'react';
import { useState } from 'react';
import check from './check.svg';
import styles from './CheckboxField.css';

function Check() {
  return (
    <img
      src={check}
      alt='Check'
      style={{ width: '10px' }}
    />
  );
}

interface Props {
  name: string;
  initialValue: boolean;
  set: (v: boolean) => void;
}

export function CheckboxField(props: Props): React.ReactElement {
  let [value, setValue] = useState(props.initialValue);

  function handleClick() {
    let isNowChecked = !value;
    setValue(isNowChecked);
    props.set(isNowChecked);
  }

  return (
    <div className={styles.container} >
      {/* Wrap in another div so that it is not stretched
      when the field is in a flex container. */}
      <div className={styles.clickable} onClick={handleClick} >
        {/* The static box prevents the label from moving when the
        check box is scaled and unscaled. */}
        <div className={styles.staticBox} >
          <div className={styles.scalingBox} >
            <div className={`${styles.checkBox} ${value ? styles.checked : styles.unchecked}`} >
              {value ? <Check /> : null}
            </div>
          </div>
        </div>
        <p className={styles.label} style={{ marginLeft: '6px' }} >
          {props.name}
        </p>
      </div>
    </div>
  );
}
