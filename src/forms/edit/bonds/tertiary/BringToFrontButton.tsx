import * as React from 'react';
import { HollowButton } from 'Forms/buttons/HollowButton';
import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { bringToFront } from 'Draw/bonds/curved/z';

export type Props = {
  app: App;

  // the tertiary bonds to bring to the front
  tertiaryBonds: TertiaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <HollowButton
      onClick={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => bringToFront(tb));
        props.app.refresh();
      }}
    >
      Bring to Front
    </HollowButton>
  );
}
