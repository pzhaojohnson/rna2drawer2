import * as React from 'react';
import { CheckboxField } from '../../fields/checkbox/CheckboxField';
import { FieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { isBold } from '../../fields/font/isBold';

function hasBoldFont(bn?: BaseNumberingInterface): boolean {
  if (bn) {
    let fw = bn.text.attr('font-weight');
    if (typeof fw == 'string' || typeof fw == 'number') {
      return isBold(fw);
    }
  }
  return false;
}

export function BoldFontField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    let first = atIndex(bns, 0);
    return (
      <CheckboxField
        name='Bold'
        initialValue={hasBoldFont(first)}
        set={shouldBeBold => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let first = atIndex(bns, 0);
            if (shouldBeBold != hasBoldFont(first)) {
              props.pushUndo();
              let fw = shouldBeBold ? 'bold' : 'normal';
              bns.forEach(bn => {
                bn.text.attr({ 'font-weight': fw });
                bn.reposition();
              });
              BaseNumbering.recommendedDefaults.text['font-weight'] = fw;
              props.changed();
            }
          }
        }}
      />
    );
  }
}
