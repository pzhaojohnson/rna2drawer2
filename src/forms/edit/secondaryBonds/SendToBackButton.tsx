import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import { sendToBack } from 'Draw/bonds/straight/z';

export type Props = {
  app: App;

  // the secondary bonds to send to the back
  secondaryBonds: SecondaryBond[];
}

export function SendToBackButton(props: Props) {
  return (
    <TextButton
      text='Send to Back'
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => sendToBack(sb));
        props.app.drawingChangedNotByInteraction();
      }}
    />
  );
}
