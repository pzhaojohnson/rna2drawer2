import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
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
