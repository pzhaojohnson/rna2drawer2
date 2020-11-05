import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import { isBold } from '../../fields/font/isBold';
import { CheckboxField } from '../../fields/CheckboxField';

function allAreBold(bns: BaseNumbering[]): boolean {
  let allBold = true;
  bns.forEach(bn => {
    if (!isBold(bn.fontWeight)) {
      allBold = false;
    }
  });
  return allBold;
}

function allAreNotBold(bns: BaseNumbering[]): boolean {
  let allNotBold = true;
  bns.forEach(bn => {
    if (isBold(bn.fontWeight)) {
      allNotBold = false;
    }
  });
  return allNotBold;
}

export function BoldFontField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <CheckboxField
        name='Bold'
        initialValue={allAreBold(bns)}
        set={shouldBeBold => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            let allBold = allAreBold(bns);
            let allNotBold = allAreNotBold(bns);
            if ((shouldBeBold && !allBold) || (!shouldBeBold && !allNotBold)) {
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
