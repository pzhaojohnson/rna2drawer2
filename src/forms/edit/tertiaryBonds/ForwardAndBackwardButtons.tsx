import * as React from 'react';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TextButton } from 'Forms/buttons/TextButton';

interface Props {
  getTertiaryBonds: () => TertiaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.pushUndo();
        props.getTertiaryBonds().forEach(tb => tb.bringToFront());
        props.changed();
      }}
    />
  );
}

export function SendToBackButton(props: Props) {
  return (
    <TextButton
      text='Send to Back'
      onClick={() => {
        props.pushUndo();
        props.getTertiaryBonds().forEach(tb => tb.sendToBack());
        props.changed();
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
