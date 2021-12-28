import * as React from 'react';
import styles from './ForwardButton.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';
import darkForwardIcon from './darkForwardIcon.svg';
import lightForwardIcon from './lightForwardIcon.svg';

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
        <img
          className={`${styles.forwardIcon} unselectable`}
          src={props.canGoForward() ? darkForwardIcon : lightForwardIcon}
          alt='Forward Icon'
        />
      </div>
    </div>
  );
}
