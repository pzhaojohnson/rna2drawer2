import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { ForwardBackwardButtons as _ForwardBackwardButtons } from 'Forms/buttons/ForwardBackwardButtons';

import { bringToFront } from 'Draw/bases/z';
import { sendToBack } from 'Draw/bases/z';

export type Props = {
  app: App; // a reference to the whole app

  bases: Base[]; // the bases to edit
};

export function ForwardBackwardButtons(props: Props) {
  return (
    <_ForwardBackwardButtons
      bringToFront={() => {
        props.app.pushUndo();
        props.bases.forEach(b => bringToFront(b));
        props.app.refresh();
      }}
      sendToBack={() => {
        props.app.pushUndo();
        props.bases.forEach(b => sendToBack(b));
        props.app.refresh();
      }}
      style={{ margin: '24px 0px 0px 1px' }}
    />
  );
}
