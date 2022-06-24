import * as React from 'react';
import styles from './BackwardButton.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';

function BackwardIcon() {
  return (
    <svg width="16px" height="16px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" overflow="hidden" >
      <defs>
        <clipPath id="clip0" >
          <rect x="592" y="312" width="96" height="96" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0)" transform="translate(-592 -312)" >
        <path
          className={styles.backwardIcon}
          d="M651.947 388.191 623.697 359.935 651.947 331.684 656.19 335.926 632.181 359.935 656.191 383.949 651.947 388.191Z"
          strokeWidth="2"
        />
      </g>
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
