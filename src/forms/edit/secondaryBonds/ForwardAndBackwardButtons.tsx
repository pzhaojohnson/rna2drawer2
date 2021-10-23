import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import { bringToFront, sendToBack } from 'Draw/bonds/straight/z';

export type Props = {
  app: App;

  // the secondary bonds to bring forward and send backward
  secondaryBonds: SecondaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => bringToFront(sb));
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
        props.secondaryBonds.forEach(sb => sendToBack(sb));
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
