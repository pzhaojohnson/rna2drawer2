import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import { FontFamilyField as Field } from '../../fields/font/FontFamilyField';

function getFontFamilies(bns: BaseNumbering[]): Set<string> {
  let ffs = new Set<string>();
  bns.forEach(bn => {
    ffs.add(bn.fontFamily);
  });
  return ffs;
}

function getInitialValue(bns: BaseNumbering[]): string | undefined {
  let ffs = getFontFamilies(bns);
  if (ffs.size == 1) {
    return ffs.values().next().value;
  }
}

export function FontFamilyField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <Field
        name='Font'
        initialValue={getInitialValue(bns)}
        set={ff => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (ff != getInitialValue(bns)) {
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
