import * as React from 'react';
import NumberField from '../../fields/text/NumberField';
import { AppInterface as App } from '../../../AppInterface';

export function AllowedMismatchField(app: App): React.ReactElement {
  let initialValue = 100 * app.strictDrawingInteraction.foldingMode.allowedMismatch;
  initialValue = Number.parseFloat(initialValue.toFixed(2));
  return (
    <NumberField
      name={'Allowed % of Mismatches'}
      initialValue={initialValue}
      checkValue={v => {
        let name = 'Allowed % of mismatches';
        if (v < 0) {
          return name + ' cannot be negative.';
        }
        if (v > 100) {
          return name + ' cannot exceed 100.';
        }
        return '';
      }}
      set={v => {
        v /= 100;
        v = Number.parseFloat(v.toFixed(2));
        app.strictDrawingInteraction.foldingMode.allowedMismatch = v;
      }}
    />
  );
}

export default AllowedMismatchField;
