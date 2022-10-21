import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';
import { ForwardBackwardButtons as _ForwardBackwardButtons } from 'Forms/buttons/ForwardBackwardButtons';

import { bringToFront } from 'Draw/bonds/straight/z';
import { sendToBack } from 'Draw/bonds/straight/z';

export type Props = {
  app: App; // a reference to the whole app

  secondaryBonds: SecondaryBond[]; // the secondary bonds to edit
};

export function ForwardBackwardButtons(props: Props) {
  return (
    <_ForwardBackwardButtons
      bringToFront={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => bringToFront(sb));
        props.app.refresh();
      }}
      sendToBack={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => sendToBack(sb));
        props.app.refresh();
      }}
      style={{ margin: '13px 0px 0px 1px' }}
    />
  );
}
