import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import { bringToFront } from 'Draw/bonds/straight/z';

export type Props = {
  app: App;

  // the secondary bonds to bring to the front
  secondaryBonds: SecondaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => bringToFront(sb));
        props.app.refresh();
      }}
    />
  );
}
