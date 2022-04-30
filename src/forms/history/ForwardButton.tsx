import * as React from 'react';
import styles from './ForwardButton.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';

function ForwardIcon() {
  return (
    <svg width="16px" height="16px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" overflow="hidden" >
      <defs>
        <clipPath id="clip0" >
          <rect x="592" y="312" width="96" height="96" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0)" transform="translate(-592 -312)" >
        <path
          className={styles.forwardIcon}
          d="M628.06 388.187 623.817 383.945 647.825 359.937 623.816 335.922 628.059 331.68 656.31 359.937 628.06 388.187Z"
          strokeWidth="0.666667"
        />
      </g>
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
