import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { CheckboxField } from '../../fields/checkbox/CheckboxField';
import baseOutlines from './baseOutlines';
import MostRecentOutlineProps from './MostRecentOutlineProps';

export function allBasesHaveOutlines(bs: Base[]): boolean {
  return bs.length == baseOutlines(bs).length;
}

export function allBasesLackOutlines(bs: Base[]): boolean {
  return baseOutlines(bs).length == 0;
}

function _addOutlines(bs: Base[]) {
  bs.forEach(b => {
    if (!b.outline) {
      let o = b.addCircleOutline();
      o?.circle.attr({
        'r': MostRecentOutlineProps.radius,
        'stroke': MostRecentOutlineProps.stroke,
        'stroke-width': MostRecentOutlineProps.strokeWidth,
        'stroke-opacity': MostRecentOutlineProps.strokeOpacity,
        'fill': MostRecentOutlineProps.fill,
        'fill-opacity': MostRecentOutlineProps.fillOpacity,
      });
      o?.sendToBack();
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
        if (bs.length > 0) {
          if (v && !allBasesHaveOutlines(bs)) {
            pushUndo();
            _addOutlines(bs);
            changed();
          } else if (!v && !allBasesLackOutlines(bs)) {
            pushUndo();
            _removeOutlines(bs);
            changed();
          }
        }
      }}
    />
  );
}

export default HasOutlineField;
