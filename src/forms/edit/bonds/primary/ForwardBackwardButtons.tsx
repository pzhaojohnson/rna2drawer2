import * as React from 'react';
import { ForwardBackwardButtons as _ForwardBackwardButtons } from 'Forms/buttons/ForwardBackwardButtons';
import type { App } from 'App';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { bringToFront, sendToBack } from 'Draw/bonds/straight/z';

export type Props = {
  app: App;

  // the primary bonds to bring forward and send backward
  primaryBonds: PrimaryBond[];
}

export function ForwardBackwardButtons(props: Props) {
  return (
    <_ForwardBackwardButtons
      bringToFront={() => {
        props.app.pushUndo();
        props.primaryBonds.forEach(pb => bringToFront(pb));
        props.app.refresh();
      }}
      sendToBack={() => {
        props.app.pushUndo();
        props.primaryBonds.forEach(pb => sendToBack(pb));
        props.app.refresh();
      }}
      style={{ margin: '11px 0px 0px 1px' }}
    />
  );
}
