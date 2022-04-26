import type { Sequence } from 'Draw/sequences/Sequence';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import * as React from 'react';
import styles from './DisplayableSequenceRange.css';

export type Props = {

  // the sequence to show the range of
  sequence: Sequence;

  style?: React.CSSProperties;
};

/**
 * Displays the range of positions in the sequence
 * in a manner that can be shown to the user
 * (i.e., accounts for any numbering offset).
 *
 * States that the sequence is empty if the sequence
 * is empty.
 */
export function DisplayableSequenceRange(props: Props) {
  let no = numberingOffset(props.sequence) ?? 0;

  let children = (
    props.sequence.length == 0 ? (
      'Sequence is empty.'
    ) : [
      <span key={0} className={styles.range} >
        {1 + no}...{props.sequence.length + no}&nbsp;
      </span>,
      <span key={1} >
        is the sequence range.
      </span>,
    ]
  );

  return (
    <p
      className={styles.displayableSequenceRange}
      style={props.style}
    >
      {children}
    </p>
  );
}
