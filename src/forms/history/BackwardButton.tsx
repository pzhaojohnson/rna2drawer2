import * as React from 'react';
import styles from './BackwardButton.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';
import darkBackwardIcon from './darkBackwardIcon.svg';
import lightBackwardIcon from './lightBackwardIcon.svg';

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
        <img
          className={`${styles.backwardIcon} unselectable`}
          src={props.canGoBackward() ? darkBackwardIcon : lightBackwardIcon}
          alt='Backward Icon'
        />
      </div>
    </div>
  );
}
