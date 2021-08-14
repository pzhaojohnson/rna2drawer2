import * as React from 'react';
import { FieldProps as Props } from './FieldProps';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { bringToFront, sendToBack } from 'Draw/bases/z';
import { TextButton } from 'Forms/buttons/TextButton';

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.pushUndo();
        props.selectedBases().forEach(b => bringToFront(b));
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
        props.selectedBases().forEach(b => sendToBack(b));
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
