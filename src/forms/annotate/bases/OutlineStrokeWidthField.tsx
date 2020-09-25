import * as React from 'react';
import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from '../../../draw/BaseAnnotationInterface';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import baseOutlines from './baseOutlines';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';
import MostRecentOutlineProps from './MostRecentOutlineProps';

function outlinesStrokeWidths(os: CircleBaseAnnotation[]): number[] {
  let sws = [] as number[];
  os.forEach(o => sws.push(o.strokeWidth));
  return sws;
}

function outlinesAllHaveSameStrokeWidth(os: CircleBaseAnnotation[]): boolean {
  return areAllSameNumber(outlinesStrokeWidths(os));
}

export function OutlineStrokeWidthField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let os = baseOutlines(selectedBases());
  let sws = outlinesStrokeWidths(os);
  let initialValue = undefined;
  if (os.length > 0 && outlinesAllHaveSameStrokeWidth(os)) {
    initialValue = sws[0];
  }
  return (
    <NonnegativeNumberField
      name={'Line Width'}
      initialValue={initialValue}
      set={sw => {
        let os = baseOutlines(selectedBases());
        if (os.length > 0) {
          let sws = outlinesStrokeWidths(os);
          if (!outlinesAllHaveSameStrokeWidth(os) || sw != sws[0]) {
            pushUndo();
            os.forEach(o => o.strokeWidth = sw);
            MostRecentOutlineProps.strokeWidth = sw;
            changed();
          }
        }
      }}
    />
  );
}

export default OutlineStrokeWidthField;
