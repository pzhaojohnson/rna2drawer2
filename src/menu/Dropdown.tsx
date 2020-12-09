import * as React from 'react';
import styles from './Dropdown.css';
import TopButton from './TopButton';

interface Props {
  name: string;
  dropped: React.ReactElement;
  disabled?: boolean;
}

export function Dropdown(props: Props): React.ReactElement {
  return (
    <div className={styles.dropdown} >
      <TopButton
        text={props.name}
        disabled={props.disabled}
      />
      {props.disabled ? null : (
        <div
          className={styles.dropped}
          style={{
            borderWidth: '0px 1px 1px 1px',
            borderStyle: 'solid',
            borderColor: 'rgba(0,0,0,0.15)',
          }}
        >
          {props.dropped}
        </div>
      )}
    </div>
  );
}
