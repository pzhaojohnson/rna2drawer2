import type { Sequence } from 'Draw/sequences/Sequence';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import * as React from 'react';
import styles from './DisplayableSequenceRange.css';

export type Props = {

  // the sequence to show the range of
  sequence: Sequence;
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
  if (props.sequence.length == 0) {
    return (
      <p className={styles.displayableSequenceRange} >
        Sequence is empty.
      </p>
    );
  }

  let no = numberingOffset(props.sequence) ?? 0;

  return (
    <p className={styles.displayableSequenceRange} >
      <span className={styles.range} >
        {1 + no}...{props.sequence.length + no}&nbsp;
      </span>
      is the sequence range.
    </p>
  );
}
