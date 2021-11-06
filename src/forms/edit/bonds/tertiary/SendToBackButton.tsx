import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { sendToBack } from 'Draw/bonds/curved/z';

export type Props = {
  app: App;

  // the tertiary bonds to send to the back
  tertiaryBonds: TertiaryBond[];
}

export function SendToBackButton(props: Props) {
  return (
    <TextButton
      text='Send to Back'
      onClick={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => sendToBack(tb));
        props.app.refresh();
      }}
    />
  );
}
