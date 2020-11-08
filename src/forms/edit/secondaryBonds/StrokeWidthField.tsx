import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';

export function StrokeWidthField(props: FieldProps): React.ReactElement {
  let sbs = props.getAllSecondaryBonds();
  let first = getAtIndex(sbs, 0);
  return (
    <NonnegativeNumberField
      name='Line Width'
      initialValue={first ? first.strokeWidth : undefined}
      set={sw => {
        let sbs = props.getAllSecondaryBonds();
        if (sbs.length > 0) {
          let first = getAtIndex(sbs, 0);
          if (!first || sw != first.strokeWidth) {
            props.pushUndo();
            sbs.forEach(sb => {
              sb.strokeWidth = sw;
            });
            props.changed();
          }
        }
      }}
    />
  );
}
