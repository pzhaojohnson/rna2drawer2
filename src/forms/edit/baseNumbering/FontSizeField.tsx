import * as React from 'react';
import { FieldProps } from './FieldProps';
import { FontSizeField as Field } from '../../fields/font/FontSizeField';
import { getAtIndex } from '../../../array/getAtIndex';

export function FontSizeField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = getAtIndex(bns, 0);
    return (
      <Field
        name='Font Size'
        initialValue={first?.fontSize}
        set={fs => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = getAtIndex(bns, 0);
            if (fs != first?.fontSize) {
              props.pushUndo();
              bns.forEach(bn => {
                bn.fontSize = fs;
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
