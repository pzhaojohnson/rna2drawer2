import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';
import { StrictDrawingInterface as StrictDrawing } from 'Draw/StrictDrawingInterface';

function hasFlatOutermostLoop(strictDrawing: StrictDrawing): boolean {
  return strictDrawing.generalLayoutProps().outermostLoopShape == 'flat';
}

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
            let generalLayoutProps = props.app.strictDrawing.generalLayoutProps();
            generalLayoutProps.outermostLoopShape = event.target.checked ? 'flat' : 'round';
            props.app.strictDrawing.setGeneralLayoutProps(generalLayoutProps);
            props.app.strictDrawing.updateLayout();
            props.app.drawingChangedNotByInteraction();
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
