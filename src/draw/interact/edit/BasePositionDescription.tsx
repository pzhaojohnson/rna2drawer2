import type { Drawing } from 'Draw/Drawing';
import type { Base } from 'Draw/bases/Base';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import * as React from 'react';
import styles from './BasePositionDescription.css';

export type Props = {

  // the drawing that the base is in
  drawing: Drawing;

  // the base whose position is to be described
  base: Base;

  style?: {
    margin?: string;
  }
}

// a paragraph element describing the position of the given base
// in its sequence
export function BasePositionDescription(props: Props) {
  let p = 0;
  let no = 0;

  let seq = props.drawing.sequences.find(seq => seq.bases.includes(props.base));
  if (seq) {
    p = seq.bases.indexOf(props.base) + 1;
    no = numberingOffset(seq) ?? 0;
  }

  if (p <= 0) {
    return <p className={styles.basePositionDescription} style={props.style} />
  }

  return (
    <p className={styles.basePositionDescription} style={props.style} >
      Position {p + no}.
    </p>
  );
}
