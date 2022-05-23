import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { bringToFront } from 'Draw/bonds/curved/z';
import { sendToBack } from 'Draw/bonds/curved/z';

import * as React from 'react';
import { ForwardBackwardButtons as _ForwardBackwardButtons } from 'Forms/buttons/ForwardBackwardButtons';

export type Props = {
  app: App; // a reference to the whole app

  // the tertiary bonds to bring to the front
  tertiaryBonds: TertiaryBond[];
}

export function ForwardBackwardButtons(props: Props) {
  return (
    <_ForwardBackwardButtons
      bringToFront={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => bringToFront(tb));
        props.app.refresh();
      }}
      sendToBack={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => sendToBack(tb));
        props.app.refresh();
      }}
      style={{ marginTop: '18px' }}
    />
  );
}
