import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function DelayedPivotingButton(props: Props) {
  return (
    <DroppedButton
      text='Delayed Dragging'
      checked={props.app.strictDrawingInteraction.pivotingMode.delayingPivots}
      onClick={() => {
        let pivotingMode = props.app.strictDrawingInteraction.pivotingMode;
        pivotingMode.delayingPivots = !pivotingMode.delayingPivots;
        props.app.renderPeripherals();
      }}
    />
  );
}
