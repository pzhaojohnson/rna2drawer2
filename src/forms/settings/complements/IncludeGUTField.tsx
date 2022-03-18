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
        checked={props.app.strictDrawingInteraction.bindingTool.complementsOptions.GUT ?? false}
        onChange={event => {
          let bindingTool = props.app.strictDrawingInteraction.bindingTool;
          bindingTool.complementsOptions.GUT = event.target.checked;
          props.app.refresh();
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Include GU and GT Pairs
      </p>
    </div>
  );
}
