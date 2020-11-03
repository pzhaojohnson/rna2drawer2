import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { ColorField } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';
import { areAllSameColor } from '../../fields/color/areAllSameColor';
import { getAtIndex } from '../../../array/getAtIndex';

function getStrokes(app: App): Svg.Color[] {
  let ss = [] as Svg.Color[];
  app.strictDrawing.drawing.forEachPrimaryBond(pb => {
    let s = parseColor(pb.stroke);
    if (s) {
      ss.push(s);
    }
  });
  return ss;
}

interface Props {
  app: App;
}

export function StrokeField(props: Props): React.ReactElement {
  let currSs = getStrokes(props.app);
  let first = getAtIndex(currSs, 0);
  let initialValue = undefined;
  if (areAllSameColor(currSs) && first) {
    initialValue = { color: first.toHex(), opacity: 1 };
  }
  return (
    <ColorField
      name='Color'
      initialValue={initialValue}
      set={co => {
        let s = parseColor(co.color);
        if (s) {
          if (props.app.strictDrawing.drawing.numPrimaryBonds > 0) {
            let currSs = getStrokes(props.app);
            let first = getAtIndex(currSs, 0);
            if (!areAllSameColor(currSs) || (first && s.toHex() != first.toHex())) {
              props.app.pushUndo();
              props.app.strictDrawing.drawing.forEachPrimaryBond(pb => {
                if (s) {
                  pb.stroke = s.toHex();
                }
              });
              props.app.drawingChangedNotByInteraction();
            }
          }
        }
      }}
      disableAlpha={true}
    />
  );
}
