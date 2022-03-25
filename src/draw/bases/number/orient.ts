import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import type { Base } from 'Draw/bases/Base';
import { atPosition } from 'Array/at';
import { isPoint2D as isPoint } from 'Math/points/Point';
import { normalizeAngle } from 'Math/angles/normalize';

type BisectingAngles = {
  clockwise: number;
  counterClockwise: number;
  inner: number;
  outer: number;
}

function bisectingAnglesAtPosition(bs: Base[], p: number): BisectingAngles {
  let b = atPosition(bs, p);
  let b5 = atPosition(bs, p - 1);
  let b3 = atPosition(bs, p + 1);

  // faster to use x and y coordinates than to retrieve center coordinates
  let xy = { x: b?.text.attr('x'), y: b?.text.attr('y') };
  let xy5 = { x: b5?.text.attr('x'), y: b5?.text.attr('y') };
  let xy3 = { x: b3?.text.attr('x'), y: b3?.text.attr('y') };

  let clockwiseAngle = Math.PI / 2; // default value
  if (isPoint(xy)) {
    if (isPoint(xy5) && isPoint(xy3)) {
      let a53 = Math.atan2(xy3.y - xy5.y, xy3.x - xy5.x);
      clockwiseAngle = a53 - (Math.PI / 2);
    } else if (isPoint(xy5)) {
      let a5 = Math.atan2(xy5.y - xy.y, xy5.x - xy.x);
      clockwiseAngle = a5 + (Math.PI / 2);
    } else if (isPoint(xy3)) {
      let a3 = Math.atan2(xy3.y - xy.y, xy3.x - xy.x);
      clockwiseAngle = a3 - (Math.PI / 2);
    }
  }
  let counterClockwiseAngle = clockwiseAngle + Math.PI;

  let innerAngle = clockwiseAngle; // default value
  if (isPoint(xy)) {
    if (isPoint(xy5) && isPoint(xy3)) {
      let a5 = Math.atan2(xy5.y - xy.y, xy5.x - xy.x);
      let diff = normalizeAngle(a5, innerAngle) - innerAngle;
      if (diff > Math.PI / 2 && diff < 3 * Math.PI / 2) {
        innerAngle = counterClockwiseAngle;
      }
    }
  }
  let outerAngle = innerAngle + Math.PI;

  return {
    clockwise: clockwiseAngle,
    counterClockwise: counterClockwiseAngle,
    inner: innerAngle,
    outer: outerAngle,
  };
}

export function orientBaseNumberings(drawing: Drawing) {
  let lineAnglesById: { [id: string]: number | undefined } = {};

  let bs = drawing.bases();
  bs.forEach((b, i) => {
    let p = i + 1;
    if (b.numbering) {
      let angles = bisectingAnglesAtPosition(bs, p);
      lineAnglesById[b.numbering.id] = angles.outer;
    }
  });

  // prevent overlap with secondary bonds
  drawing.secondaryBonds.forEach(sb => {
    if (sb.base1.numbering || sb.base2.numbering) {
      let xy1 = { x: sb.base1.text.attr('x'), y: sb.base1.text.attr('y') };
      let xy2 = { x: sb.base2.text.attr('x'), y: sb.base2.text.attr('y') };

      if (isPoint(xy1) && isPoint(xy2)) {
        let a12 = Math.atan2(xy2.y - xy1.y, xy2.x - xy1.x);

        if (sb.base1.numbering) {
          let la1 = lineAnglesById[sb.base1.numbering.id];
          if (typeof la1 == 'number') {
            let diff = normalizeAngle(la1, a12) - a12;
            if (diff < Math.PI / 2 || diff > 3 * Math.PI / 2) {
              lineAnglesById[sb.base1.numbering.id] = la1 + Math.PI;
            }
          }
        }

        if (sb.base2.numbering) {
          let la2 = lineAnglesById[sb.base2.numbering.id];
          if (typeof la2 == 'number') {
            let diff = normalizeAngle(la2, a12) - a12;
            if (diff > Math.PI / 2 && diff < 3 * Math.PI / 2) {
              lineAnglesById[sb.base2.numbering.id] = la2 + Math.PI;
            }
          }
        }
      }
    }
  });

  // finally set line angles
  bs.forEach(b => {
    if (b.numbering) {
      let la = lineAnglesById[b.numbering.id];
      if (typeof la == 'number') {
        b.numbering.lineAngle = la;
      }
    }
  });
}
