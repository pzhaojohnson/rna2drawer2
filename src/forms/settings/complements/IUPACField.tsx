import { AppInterface as App } from 'AppInterface';

import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';

export type Props = {

  // a reference to the whole app
  app: App;
}

export function IUPACField(props: Props) {
  let bindingTool = props.app.strictDrawingInteraction.bindingTool;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={bindingTool.complementsOptions.IUPAC ?? false}
        onChange={event => {
          let bindingTool = props.app.strictDrawingInteraction.bindingTool;
          bindingTool.complementsOptions.IUPAC = event.target.checked;
          props.app.refresh();
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Use IUPAC Single Letter Codes
      </p>
    </div>
  );
}
