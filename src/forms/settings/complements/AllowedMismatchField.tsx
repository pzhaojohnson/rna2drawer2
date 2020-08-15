import * as React from 'react';
import NumberField from '../../fields/text/NumberField';
import App from '../../../App';

export function AllowedMismatchField(app: App): React.ReactElement {
  return (
    <NumberField
      name={'Allowed % of Mismatches'}
      initialValue={100 * app.strictDrawingInteraction.foldingMode.allowedMismatch}
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
        app.strictDrawingInteraction.foldingMode.allowedMismatch = v / 100;
      }}
    />
  );
}

export default AllowedMismatchField;
