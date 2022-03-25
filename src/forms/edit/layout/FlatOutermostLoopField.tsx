import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import type { App } from 'App';
import { hasFlatOutermostLoop } from './hasFlatOutermostLoop';

export type Props = {
  app: App;
}

export function FlatOutermostLoopField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={hasFlatOutermostLoop(props.app.strictDrawing)}
        onChange={event => {
          if (event.target.checked != hasFlatOutermostLoop(props.app.strictDrawing)) {
            props.app.pushUndo();
            let generalLayoutProps = props.app.strictDrawing.generalLayoutProps;
            generalLayoutProps.outermostLoopShape = event.target.checked ? 'flat' : 'round';
            props.app.strictDrawing.updateLayout();
            props.app.refresh();
          }
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Flat Outermost Loop
      </p>
    </div>
  );
}
