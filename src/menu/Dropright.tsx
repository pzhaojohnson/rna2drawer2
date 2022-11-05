import * as React from 'react';
import styles from './Dropright.css';

function RightCaret() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3.89 6.72"
      style={{ height: '12px' }}
    >
      <path
        d="M 0.53 0.53 L 3.36 3.36 L 0.53 6.19"
        stroke="#38383c" strokeWidth="0.75"
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
