import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { ForwardBackwardButtons as _ForwardBackwardButtons } from 'Forms/buttons/ForwardBackwardButtons';

export type Props = {
  app: App; // a reference to the whole app

  bases: Base[]; // the bases to edit
};

export function ForwardBackwardButtons(props: Props) {
  return (
    <_ForwardBackwardButtons
      bringToFront={() => {
        props.app.pushUndo();
        props.bases.forEach(b => b.text.front());
        props.app.refresh();
      }}
      sendToBack={() => {
        props.app.pushUndo();
        props.bases.forEach(b => b.text.back());
        props.app.refresh();
      }}
      style={{ margin: '9px 0px 0px 1px' }}
    />
  );
}
