import * as React from 'react';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { FieldProps } from './FieldProps';
import { FontSizeField as Field } from '../../fields/font/FontSizeField';

function getFontSizes(bns: BaseNumbering[]): Set<number> {
  let fss = new Set<number>();
  bns.forEach(bn => {
    fss.add(bn.fontSize);
  });
  return fss;
}

function getInitialValue(bns: BaseNumbering[]): number | undefined {
  let fss = getFontSizes(bns);
  if (fss.size == 1) {
    return fss.values().next().value;
  }
}

export function FontSizeField(props: FieldProps): React.ReactElement | null {
  let bns = props.getBaseNumberings();
  if (bns.length == 0) {
    return null;
  } else {
    return (
      <Field
        name='Font Size'
        initialValue={getInitialValue(bns)}
        set={fs => {
          let bns = props.getBaseNumberings();
          if (bns.length > 0) {
            if (fs != getInitialValue(bns)) {
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
