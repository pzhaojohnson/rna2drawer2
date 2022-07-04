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

  let firstPosition = props.sequence.length == 0 ? no : 1 + no;
  let lastPosition = props.sequence.length + no;

  return (
    <p
      className={styles.displayableSequenceRange}
      style={props.style}
    >
      <span className={styles.range} >
        {firstPosition}...{lastPosition}&nbsp;
      </span>
      <span>
        is the sequence range.
      </span>
    </p>
  );
}
