import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { DroppedButton } from 'Menu/DroppedButton';

interface Props {
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
