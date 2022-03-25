import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import type { App } from 'App';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { bringToFront } from 'Draw/bonds/curved/z';

export type Props = {
  app: App;

  // the tertiary bonds to bring to the front
  tertiaryBonds: TertiaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => bringToFront(tb));
        props.app.refresh();
      }}
    />
  );
}
