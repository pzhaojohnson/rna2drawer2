import * as React from 'react';
import { FontFamilyField as Field } from '../../fields/font/FontFamilyField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';

export function FontFamilyField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = atIndex(bns, 0);
    let fontFamily = first?.text.attr('font-family');
    return (
      <Field
        name='Font'
        initialValue={typeof fontFamily == 'string' ? fontFamily : undefined}
        set={ff => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = atIndex(bns, 0);
            let fontFamily = first?.text.attr('font-family');
            if (ff != fontFamily) {
              props.pushUndo();
              bns.forEach(bn => {
                bn.text.attr({ 'font-family': ff });
                bn.repositionText();
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
