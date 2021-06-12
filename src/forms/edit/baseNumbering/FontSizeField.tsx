import * as React from 'react';
import { FieldProps } from './FieldProps';
import { FontSizeField as Field } from '../../fields/font/FontSizeField';
import { atIndex } from 'Array/at';

export function FontSizeField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = atIndex(bns, 0);
    let fontSize = first?.text.attr('font-size');
    return (
      <Field
        name='Font Size'
        initialValue={typeof fontSize == 'number' ? fontSize : undefined}
        set={fs => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = atIndex(bns, 0);
            let fontSize = first?.text.attr('font-size');
            if (fs != fontSize) {
              props.pushUndo();
              bns.forEach(bn => {
                bn.text.attr({ 'font-size': fs });
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
