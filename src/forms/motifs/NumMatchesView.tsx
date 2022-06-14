import type { Match } from './FindMotifsForm';

import * as React from 'react';
import styles from './NumMatchesView.css';

export type Props = {
  matches: Match[];
};

export function NumMatchesView(props: Props) {
  let es = props.matches.length == 1 ? '' : 'es';
  return (
    <p className={styles.numMatchesView} >
      {props.matches.length} Match{es} found.
    </p>
  );
}
