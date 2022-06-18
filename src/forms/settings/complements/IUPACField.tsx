import type { App } from 'App';

import * as React from 'react';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';

export type Props = {

  // a reference to the whole app
  app: App;
}

export function IUPACField(props: Props) {
  let bindingTool = props.app.strictDrawingInteraction.bindingTool;

  return (
    <CheckboxField
      label='Use IUPAC Single Letter Codes'
      checked={bindingTool.complementsOptions.IUPAC ?? false}
      onChange={event => {
        let bindingTool = props.app.strictDrawingInteraction.bindingTool;
        bindingTool.complementsOptions.IUPAC = event.target.checked;
        props.app.refresh();
      }}
      style={{ alignSelf: 'start' }}
    />
  );
}
