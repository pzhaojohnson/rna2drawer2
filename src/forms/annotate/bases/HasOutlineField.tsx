import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import CheckboxField from '../../fields/CheckboxField';

export function allBasesHaveOutlines(bs: Base[]): boolean {
  let allHave = true;
  bs.forEach(b => {
    if (!b.hasOutline()) {
      allHave = false;
    }
  });
  return allHave;
}

export function allBasesLackOutlines(bs: Base[]): boolean {
  let allLack = true;
  bs.forEach(b => {
    if (b.hasOutline()) {
      allLack = false;
    }
  });
  return allLack;
}

export function HasOutlineField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let bs = selectedBases();
  let initialValue = bs.length == 0 ? false : allBasesHaveOutlines(bs);
  return (
    <CheckboxField
      name={'Outline'}
      initialValue={initialValue}
      set={v => {
        let bs = selectedBases();
        if (bs.length == 0) {
          return;
        }
        if (v && !allBasesHaveOutlines(bs)) {
          pushUndo();
          bs.forEach(b => {
            if (!b.outline) {
              let o = b.addCircleOutline();
              o.back();
            }
          });
          changed();
        } else if (!v && !allBasesLackOutlines(bs)) {
          pushUndo();
          bs.forEach(b => b.removeOutline());
          changed();
        }
      }}
    />
  );
}

export default HasOutlineField;
