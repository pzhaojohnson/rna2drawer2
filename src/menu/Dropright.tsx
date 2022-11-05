import * as React from 'react';
import styles from './Dropright.css';

function RightCaret() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7px" height="12px"
      viewBox="0 0 7 12"
    >
      <path
        d="M 1.25 1 L 6.25 6 L 1.25 11"
        stroke="#38383c" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        fillOpacity="0"
      />
    </svg>
  );
}

export type Props = {
  name: string;

  // the content of the dropright menu
  dropped: React.ReactNode;
}

export function Dropright(props: Props) {
  return (
    <div className={styles.dropright} >
      <div
        className={styles.button}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <p className={styles.buttonText} style={{ flexGrow: 1, textAlign: 'left' }} >
          {props.name}
        </p>
        <RightCaret />
      </div>
      <div className={styles.droppedContainer} >
        {props.dropped}
      </div>
    </div>
  );
}
