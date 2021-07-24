import * as React from 'react';
import { FieldProps } from './FieldProps';
import { TextButton } from 'Forms/buttons/TextButton';
import { bringToFront, sendToBack } from 'Draw/bonds/straight/z';

export function BringToFrontButton(props: FieldProps) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.pushUndo();
        props.getAllSecondaryBonds().forEach(sb => bringToFront(sb));
        props.changed();
      }}
    />
  );
}

export function SendToBackButton(props: FieldProps) {
  return (
    <TextButton
      text='Send to Back'
      onClick={() => {
        props.pushUndo();
        props.getAllSecondaryBonds().forEach(sb => sendToBack(sb));
        props.changed();
      }}
    />
  );
}

export function ForwardAndBackwardButtons(props: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }} >
      <BringToFrontButton {...props} />
      <div style={{ width: '16px' }} ></div>
      <SendToBackButton {...props} />
    </div>
  );
}
