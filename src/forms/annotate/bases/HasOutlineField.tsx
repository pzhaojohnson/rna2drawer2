import * as React from 'react';
import { FieldProps as Props } from './FieldProps';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { CheckboxField } from '../../fields/checkbox/CheckboxField';
import { addCircleOutline, removeCircleOutline } from 'Draw/bases/annotate/circle/add';
import {
  sendToBack as sendOutlineToBack,
} from 'Draw/bases/annotate/circle/z';
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
      addCircleOutline(b);
    }
    if (b.outline) {
      b.outline.circle.attr({
        'r': MostRecentOutlineProps.radius,
        'stroke': MostRecentOutlineProps.stroke,
        'stroke-width': MostRecentOutlineProps.strokeWidth,
        'stroke-opacity': MostRecentOutlineProps.strokeOpacity,
        'fill': MostRecentOutlineProps.fill,
        'fill-opacity': MostRecentOutlineProps.fillOpacity,
      });
      sendOutlineToBack(b.outline);
    }
  });
}

function _removeOutlines(bs: Base[]) {
  bs.forEach(b => removeCircleOutline(b));
}

export function HasOutlineField(props: Props): React.ReactElement {
  let bs = props.selectedBases();
  let initialValue = bs.length == 0 ? false : allBasesHaveOutlines(bs);
  return (
    <CheckboxField
      name={'Outline'}
      initialValue={initialValue}
      set={v => {
        let bs = props.selectedBases();
        if (bs.length > 0) {
          if (v && !allBasesHaveOutlines(bs)) {
            props.pushUndo();
            _addOutlines(bs);
            props.changed();
          } else if (!v && !allBasesLackOutlines(bs)) {
            props.pushUndo();
            _removeOutlines(bs);
            props.changed();
          }
        }
      }}
    />
  );
}

export default HasOutlineField;
