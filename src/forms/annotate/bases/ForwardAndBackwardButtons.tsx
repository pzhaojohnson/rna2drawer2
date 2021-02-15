import * as React from 'react';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { TextButton } from 'Forms/buttons/TextButton';

interface Props {
  selectedBases: () => Base[];
  pushUndo: () => void;
  changed: () => void;
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.pushUndo();
        props.selectedBases().forEach(b => b.bringToFront());
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
        props.selectedBases().forEach(b => b.sendToBack());
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
