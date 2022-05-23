import * as React from 'react';
import { HollowButton } from 'Forms/buttons/HollowButton';
import type { App } from 'App';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { bringToFront, sendToBack } from 'Draw/bonds/straight/z';

export type Props = {
  app: App;

  // the primary bonds to bring forward and send backward
  primaryBonds: PrimaryBond[];
}

export function BringToFrontButton(props: Props) {
  return (
    <HollowButton
      onClick={() => {
        props.app.pushUndo();
        props.primaryBonds.forEach(pb => bringToFront(pb));
        props.app.refresh();
      }}
    >
      Bring to Front
    </HollowButton>
  );
}

export function SendToBackButton(props: Props) {
  return (
    <HollowButton
      onClick={() => {
        props.app.pushUndo();
        props.primaryBonds.forEach(pb => sendToBack(pb));
        props.app.refresh();
      }}
    >
      Send to Back
    </HollowButton>
  );
}

export function ForwardAndBackwardButtons(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }} >
      <BringToFrontButton {...props} />
      <div style={{ width: '8px' }} ></div>
      <SendToBackButton {...props} />
    </div>
  );
}
