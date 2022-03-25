import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';
import { sendToBack } from 'Draw/bases/z';

export type Props = {
  app: App;

  // the bases to send to the back
  bases: Base[];
}

export function SendToBackButton(props: Props) {
  return (
    <TextButton
      text='Send to Back'
      onClick={() => {
        props.app.pushUndo();
        props.bases.forEach(b => sendToBack(b));
        props.app.refresh();
      }}
    />
  );
}
