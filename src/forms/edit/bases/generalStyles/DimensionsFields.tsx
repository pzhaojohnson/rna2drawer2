import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { NonnegativeNumberField } from '../../../fields/text/NonnegativeNumberField';

interface Props {
  app: App;
}

export function WidthField(props: Props): React.ReactElement {
  return (
    <NonnegativeNumberField
      name='Width'
      initialValue={props.app.strictDrawing.baseWidth}
      set={w => {
        if (w != props.app.strictDrawing.baseWidth) {
          props.app.pushUndo();
          props.app.strictDrawing.baseWidth = w;
          props.app.strictDrawing.applyLayout();
          props.app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}

export function HeightField(props: Props): React.ReactElement {
  return (
    <NonnegativeNumberField
      name='Height'
      initialValue={props.app.strictDrawing.baseHeight}
      set={h => {
        if (h != props.app.strictDrawing.baseHeight) {
          props.app.pushUndo();
          props.app.strictDrawing.baseHeight = h;
          props.app.strictDrawing.applyLayout();
          props.app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}
