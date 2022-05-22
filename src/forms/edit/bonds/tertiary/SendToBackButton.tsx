import * as React from 'react';
import { HollowButton } from 'Forms/buttons/HollowButton';
import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { sendToBack } from 'Draw/bonds/curved/z';

export type Props = {
  app: App;

  // the tertiary bonds to send to the back
  tertiaryBonds: TertiaryBond[];
}

export function SendToBackButton(props: Props) {
  return (
    <HollowButton
      onClick={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => sendToBack(tb));
        props.app.refresh();
      }}
    >
      Send to Back
    </HollowButton>
  );
}
