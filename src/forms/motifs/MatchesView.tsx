import type { Match } from './FindMotifsForm';

import * as React from 'react';
import styles from './MatchesView.css';

import { compareNumbersDescending } from 'Array/sort';

function ColumnLabels() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'end' }} >
      <p className={styles.startPositionColumnLabel} >
        Start Position
      </p>
      <p className={styles.matchingMotifColumnLabel} >
        Matching Motif
      </p>
    </div>
  );
}

function MatchView(
  props: {
    match: Match,
    numberingOffset: number,
    onClick: () => void,
    startPositionView: {
      style: { width: string },
    },
  }
) {
  let offsetStartPosition = props.match.startPosition + props.numberingOffset;

  let matchingMotif = props.match.matchingMotif;
  if (matchingMotif.length > 24) {
    matchingMotif = matchingMotif.substring(0, 24) + '...';
  }

  return (
    <div
      className={styles.matchView}
      onClick={props.onClick}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <p
        className={styles.startPositionView}
        style={{ width: props.startPositionView.style.width }}
      >
        {offsetStartPosition}
      </p>
      <p className={styles.matchingMotifView} >
        {matchingMotif}
      </p>
    </div>
  );
}

export type Props = {
  matches: Match[];

  numberingOffset: number | undefined;


  /**
   * Called when a match is selected by the user (e.g., clicked on).
   */
  onMatchSelect: (match: Match) => void;
};

export function MatchesView(props: Props) {
  let numberingOffset = props.numberingOffset ?? 0;

  let startPositions = props.matches.map(match => match.startPosition);
  let offsetStartPositions = startPositions.map(p => p + numberingOffset);

  let offsetStartPositionLengths = offsetStartPositions.map(p => p.toString().length);
  offsetStartPositionLengths.sort(compareNumbersDescending);

  // is undefined if matches array is empty
  let maxOffsetStartPositionLength: number | undefined = offsetStartPositionLengths[0];

  return (
    <div>
      <div style={{ height: '10px' }} />
      <ColumnLabels />
      <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column' }} >
        {props.matches.map((match, i) => (
          <MatchView
            key={i}
            match={match}
            numberingOffset={numberingOffset}
            onClick={() => props.onMatchSelect(match)}
            startPositionView={{
              style: {
                width: (maxOffsetStartPositionLength ?? 0) + 'ch',
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
