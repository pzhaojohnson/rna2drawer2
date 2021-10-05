import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';

export type Props = {
  app: App;
}

export function IncludeGUTField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={props.app.strictDrawingInteraction.foldingMode.includeGUT}
        onChange={event => {
          props.app.strictDrawingInteraction.foldingMode.includeGUT = event.target.checked;
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '8px' }}
      >
        Include GU and GT Pairs
      </p>
    </div>
  );
}
