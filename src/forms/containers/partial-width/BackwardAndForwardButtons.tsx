import * as React from 'react';
import styles from './BackwardAndForwardButtons.css';
import { FormHistoryInterface as Props } from 'Forms/history/FormHistoryInterface';
import { BackwardButton } from './BackwardButton';
import { ForwardButton } from './ForwardButton';

export function BackwardAndForwardButtons(props: Props) {
  if (!props.canGoBackward() && !props.canGoForward()) {
    return null;
  }

  return (
    <div className={`${styles.backwardAndForwardButtons}`} >
      <BackwardButton {...props} />
      <div style={{ width: '2px' }} />
      <ForwardButton {...props} />
    </div>
  );
}
