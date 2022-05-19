import type { App } from 'App';

import * as React from 'react';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';

import { hasFlatOutermostLoop } from './hasFlatOutermostLoop';

export type Props = {
  app: App; // a reference to the whole app
}

export function FlatOutermostLoopField(props: Props) {
  return (
    <CheckboxField
      label='Flat Outermost Loop'
      checked={hasFlatOutermostLoop(props.app.strictDrawing)}
      onChange={event => {
        if (event.target.checked == hasFlatOutermostLoop(props.app.strictDrawing)) {
          return;
        }

        props.app.pushUndo();

        // set outermost loop shape
        let outermostLoopShape = event.target.checked ? 'flat' : 'round';
        props.app.strictDrawing.generalLayoutProps.outermostLoopShape = outermostLoopShape;
        props.app.strictDrawing.updateLayout();

        props.app.refresh();
      }}
      style={{ alignSelf: 'start' }}
    />
  );
}
