import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { dotify } from 'Draw/bonds/straight/dotify';
import { squarify } from 'Draw/bonds/straight/dotify';

import * as React from 'react';
import styles from './ShapifyButtons.css';

export type Props = {

  // a reference to the whole app
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
};

export function DotifyButton(props: Props) {
  return (
    <button
      className={styles.shapifyButton}
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(bond => dotify(bond));
        props.app.refresh();
      }}
    >
      Dots
    </button>
  );
}

export function SquarifyButton(props: Props) {
  return (
    <button
      className={styles.shapifyButton}
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(bond => squarify(bond));
        props.app.refresh();
      }}
    >
      Squares
    </button>
  );
}

export function ShapifyButtons(props: Props) {
  return (
    <div style={{ margin: '16px 0px 0px 0px', display: 'flex', alignItems: 'center' }} >
      <p className={styles.convertToLabel} >
        Convert to...
      </p>
      <DotifyButton {...props} />
      <div style={{ width: '8px' }} />
      <SquarifyButton {...props} />
    </div>
  );
}
