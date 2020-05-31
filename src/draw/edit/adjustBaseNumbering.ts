import { DrawingInterface as Drawing } from '../DrawingInterface';
import Base from '../Base';
import normalizeAngle from '../normalizeAngle';

export function adjustBaseNumbering(drawing: Drawing) {
  drawing.forEachSequence(seq => {
    seq.forEachBase((b: Base, p: number) => {
      if (b.hasNumbering()) {
        b.numbering.lineAngle = seq.outerNormalAngleAtPosition(p);
      }
    });
  });
  drawing.forEachSecondaryBond(sb => {
    let b1 = sb.base1;
    let b2 = sb.base2;
    let ba12 = b1.angleBetweenCenters(b2);
    let ba21 = b2.angleBetweenCenters(b1);
    if (b1.hasNumbering()) {
      let la = normalizeAngle(b1.numbering.lineAngle, ba12) - ba12;
      if (la < Math.PI / 4 || la > 7 * Math.PI / 4) {
        b1.numbering.lineAngle = b1.numbering.lineAngle + Math.PI;
      }
    }
    if (b2.hasNumbering()) {
      let la = normalizeAngle(b2.numbering.lineAngle, ba21) - ba21;
      if (la < Math.PI / 4 || la > 7 * Math.PI / 4) {
        b2.numbering.lineAngle = b2.numbering.lineAngle + Math.PI;
      }
    }
  });
}

export default adjustBaseNumbering;
