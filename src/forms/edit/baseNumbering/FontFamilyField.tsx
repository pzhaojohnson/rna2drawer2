import * as React from 'react';
import { FontFamilyField as Field } from '../../fields/font/FontFamilyField';
import { FieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';

export function FontFamilyField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = getAtIndex(bns, 0);
    return (
      <Field
        name='Font'
        initialValue={first ? first.fontFamily : undefined}
        set={ff => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = getAtIndex(bns, 0);
            if (!first || ff != first.fontFamily) {
              props.pushUndo();
              bns.forEach(bn => {
                bn.fontFamily = ff;
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
