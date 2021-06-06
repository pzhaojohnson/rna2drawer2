import * as React from 'react';
import { CheckboxField } from '../../fields/checkbox/CheckboxField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { isBold } from '../../fields/font/isBold';

export function BoldFontField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = atIndex(bns, 0);
    return (
      <CheckboxField
        name='Bold'
        initialValue={first ? isBold(first.fontWeight) : false}
        set={shouldBeBold => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = atIndex(bns, 0);
            let firstIsBold = first ? isBold(first.fontWeight) : false;
            if (!first || shouldBeBold != firstIsBold) {
              props.pushUndo();
              bns.forEach(bn => {
                bn.fontWeight = shouldBeBold ? 'bold' : 'normal';
              });
              props.changed();
            }
          }
        }}
      />
    );
  }
}
