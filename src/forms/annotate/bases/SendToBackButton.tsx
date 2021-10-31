import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
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
        props.app.drawingChangedNotByInteraction();
      }}
    />
  );
}
