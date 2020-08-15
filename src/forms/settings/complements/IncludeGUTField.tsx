import * as React from 'react';
import CheckboxField from '../../fields/CheckboxField';
import App from '../../../App';

export function IncludeGUTField(app: App): React.ReactElement {
  return (
    <CheckboxField
      name={'Include GU and GT Pairs'}
      initialValue={app.strictDrawingInteraction.foldingMode.includeGUT}
      set={v => {
        app.strictDrawingInteraction.foldingMode.includeGUT = v;
      }}
    />
  );
}

export default IncludeGUTField;
