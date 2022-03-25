import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import type { App } from 'App';
import { bringToFront, sendToBack } from 'Draw/bases/number/z';

export type Props = {
  app: App;
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.app.strictDrawing.drawing.bases().forEach(b => {
          if (b.numbering) {
            bringToFront(b.numbering);
          }
        });
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
        props.app.strictDrawing.drawing.bases().forEach(b => {
          if (b.numbering) {
            sendToBack(b.numbering);
          }
        });
        props.app.refresh();
      }}
    />
  );
}

export function ForwardAndBackwardButtons(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <BringToFrontButton {...props} />
      <div style={{ width: '16px' }} />
      <SendToBackButton {...props} />
    </div>
  );
}
