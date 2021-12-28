import * as React from 'react';
import styles from './BackwardForwardButtons.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';
import { BackwardButton } from 'Forms/history/BackwardButton';
import { ForwardButton } from 'Forms/history/ForwardButton';

export function BackwardForwardButtons(props: Props) {
  if (!props.canGoBackward() && !props.canGoForward()) {
    return null;
  }

  return (
    <div className={`${styles.backwardForwardButtons}`} >
      <BackwardButton {...props} />
      <ForwardButton {...props} />
    </div>
  );
}
