import * as React from 'react';
import styles from './NumMatchesView.css';

export type Props = {
  numMatches: number;
};

export function NumMatchesView(props: Props) {
  let es = props.numMatches == 1 ? '' : 'es';

  return (
    <p className={styles.numMatchesView} >
      <span style={{ fontWeight: 700, fontStyle: 'normal', color: 'rgb(17, 17, 18)' }} >
        {props.numMatches}
      </span>
      &nbsp;Match{es} found.
    </p>
  );
}
