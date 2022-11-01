import * as React from 'react';
import styles from './BackwardButton.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';

function BackwardIcon() {
  let props = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '8px',
    height: '12px',
    viewBox: '0 0 8 12',
  };

  let path = (
    <path
      className={styles.backwardIcon}
      d='M 6.25 1.75 L 1.75 6 L 6.25 10.25'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      fillOpacity='0'
    />
  );

  return (
    <svg {...props} >
      {path}
    </svg>
  );
}

export function BackwardButton(props: Props) {
  return (
    <div
      className={`
        ${styles.backwardButton}
        ${props.canGoBackward() ? styles.enabled : styles.disabled}
      `}
      title={props.canGoBackward() ? 'Go to previous form.' : undefined}
      onClick={() => {
        if (props.canGoBackward()) {
          props.goBackward();
        }
      }}
    >
      <div className={`${styles.backwardIconContainer}`} >
        <BackwardIcon />
      </div>
    </div>
  );
}
