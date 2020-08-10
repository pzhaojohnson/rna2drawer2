import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import CheckboxField from '../../fields/CheckboxField';
import MostRecentOutlineProps from './MostRecentOutlineProps';

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

function _addOutlines(bs: Base[]) {
  bs.forEach(b => {
    if (!b.outline) {
      let o = b.addCircleOutline();
      o.radius = MostRecentOutlineProps.radius;
      o.fill = MostRecentOutlineProps.fill;
      o.fillOpacity = MostRecentOutlineProps.fillOpacity;
      o.stroke = MostRecentOutlineProps.stroke;
      o.strokeWidth = MostRecentOutlineProps.strokeWidth;
      o.strokeOpacity = MostRecentOutlineProps.strokeOpacity;
      o.back();
    }
  });
}

function _removeOutlines(bs: Base[]) {
  bs.forEach(b => b.removeOutline());
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
          _addOutlines(bs);
          changed();
        } else if (!v && !allBasesLackOutlines(bs)) {
          pushUndo();
          _removeOutlines(bs);
          changed();
        }
      }}
    />
  );
}

export default HasOutlineField;
