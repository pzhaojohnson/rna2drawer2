import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { dotify } from 'Draw/bonds/straight/dotify';
import { squarify } from 'Draw/bonds/straight/dotify';

import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';

export type Props = {

  // a reference to the whole app
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];
};

export function DotifyButton(props: Props) {
  return (
    <TextButton
      text='Dotify...'
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(bond => dotify(bond));
        props.app.refresh();
      }}
    />
  );
}

export function SquarifyButton(props: Props) {
  return (
    <TextButton
      text='Squarify...'
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(bond => squarify(bond));
        props.app.refresh();
      }}
    />
  );
}

export function DotifyAndSquarifyButtons(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <DotifyButton {...props} />
      <div style={{ width: '48px' }} />
      <SquarifyButton {...props} />
    </div>
  );
}
