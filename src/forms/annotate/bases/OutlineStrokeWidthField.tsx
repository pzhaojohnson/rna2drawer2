import * as React from 'react';
import { FieldProps as Props } from './FieldProps';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import baseOutlines from './baseOutlines';
import { areAllSameNumber } from '../../fields/text/areAllSameNumber';
import MostRecentOutlineProps from './MostRecentOutlineProps';

function outlinesStrokeWidths(os: CircleBaseAnnotation[]): number[] {
  let sws = [] as number[];
  os.forEach(o => {
    let sw = o.circle.attr('stroke-width');
    if (typeof sw == 'number') {
      sws.push(sw);
    }
  });
  return sws;
}

function outlinesAllHaveSameStrokeWidth(os: CircleBaseAnnotation[]): boolean {
  return areAllSameNumber(outlinesStrokeWidths(os));
}

export function OutlineStrokeWidthField(props: Props): React.ReactElement {
  let os = baseOutlines(props.selectedBases());
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
        let os = baseOutlines(props.selectedBases());
        if (os.length > 0) {
          let sws = outlinesStrokeWidths(os);
          if (!outlinesAllHaveSameStrokeWidth(os) || sw != sws[0]) {
            props.pushUndo();
            os.forEach(o => o.circle.attr({ 'stroke-width': sw }));
            MostRecentOutlineProps.strokeWidth = sw;
            props.changed();
          }
        }
      }}
    />
  );
}

export default OutlineStrokeWidthField;
