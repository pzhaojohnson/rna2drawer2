import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';
import { bringToFront, sendToBack } from 'Draw/bonds/straight/z';

export type Props = {
  app: App;

  // the primary bonds to bring forward and send backward
  primaryBonds: PrimaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.primaryBonds.forEach(pb => bringToFront(pb));
        props.app.refresh();
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
        props.primaryBonds.forEach(pb => sendToBack(pb));
        props.app.refresh();
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
