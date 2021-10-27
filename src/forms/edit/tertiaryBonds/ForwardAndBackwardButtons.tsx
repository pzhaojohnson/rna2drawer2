import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { bringToFront, sendToBack } from 'Draw/bonds/curved/z';

export type Props = {
  app: App;
  
  // the tertiary bonds to bring forward and send backward
  tertiaryBonds: TertiaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => bringToFront(tb));
        props.app.drawingChangedNotByInteraction();
      }}
    />
  );
}

export function SendToBackButton(props: Props) {
  return (
    <TextButton
      text='Send to Back'
      onClick={() => {
        props.app.pushUndo();
        props.tertiaryBonds.forEach(tb => sendToBack(tb));
        props.app.drawingChangedNotByInteraction();
      }}
    />
  );
}

export function ForwardAndBackwardButtons(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }} >
      <BringToFrontButton {...props} />
      <div style={{ width: '16px' }} ></div>
      <SendToBackButton {...props} />
    </div>
  );
}
