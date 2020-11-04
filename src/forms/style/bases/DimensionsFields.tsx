import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';

interface Props {
  app: App;
}

export function WidthField(props: Props): React.ReactElement {
  return (
    <NonnegativeNumberField
      name='Width'
      initialValue={props.app.strictDrawing.baseWidth}
      set={w => {
        props.app.strictDrawing.baseWidth = w;
        props.app.strictDrawing.applyLayout();
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
        props.app.strictDrawing.baseHeight = h;
        props.app.strictDrawing.applyLayout();
      }}
    />
  );
}
