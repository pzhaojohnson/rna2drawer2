import * as React from 'react';
import styles from './ForwardButton.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';

function ForwardIcon() {
  let props = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '8px',
    height: '12px',
    viewBox: '0 0 8 12',
  };

  let path = (
    <path
      className={styles.forwardIcon}
      d='M 1.75 1.75 L 6.25 6 L 1.75 10.25'
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

export function ForwardButton(props: Props) {
  return (
    <div
      className={`
        ${styles.forwardButton}
        ${props.canGoForward() ? styles.enabled : styles.disabled}
      `}
      onClick={() => {
        if (props.canGoForward()) {
          props.goForward();
        }
      }}
    >
      <div className={`${styles.forwardIconContainer}`} >
        <ForwardIcon />
      </div>
    </div>
  );
}
