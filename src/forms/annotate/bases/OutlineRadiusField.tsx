import * as React from 'react';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import baseOutlines from './baseOutlines';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';
import MostRecentOutlineProps from './MostRecentOutlineProps';

function outlineRadii(os: CircleBaseAnnotation[]): number[] {
  let rs = [] as number[];
  os.forEach(o => {
    let r = o.circle.attr('r');
    if (typeof r == 'number') {
      rs.push(r);
    }
  });
  return rs;
}

function outlinesAllHaveSameRadius(os: CircleBaseAnnotation[]): boolean {
  return areAllSameNumber(outlineRadii(os));
}

export function OutlineRadiusField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let os = baseOutlines(selectedBases());
  let rs = outlineRadii(os);
  let initialValue = undefined;
  if (os.length > 0 && outlinesAllHaveSameRadius(os)) {
    initialValue = rs[0];
  }
  return (
    <NonnegativeNumberField
      name={'Radius'}
      initialValue={initialValue}
      set={r => {
        let os = baseOutlines(selectedBases());
        if (os.length > 0) {
          let rs = outlineRadii(os);
          if (!outlinesAllHaveSameRadius(os) || r != rs[0]) {
            pushUndo();
            os.forEach(o => o.circle.attr({ 'r': r }));
            MostRecentOutlineProps.radius = r;
            changed();
          }
        }
      }}
    />
  );
}

export default OutlineRadiusField;
