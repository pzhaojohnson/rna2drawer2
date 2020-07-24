import { DrawingInterface as Drawing } from '../DrawingInterface';
import { BaseInterface as Base } from '../BaseInterface';
import normalizeAngle from '../normalizeAngle';
import anglesAreClose from '../anglesAreClose';

export function adjustBaseNumbering(drawing: Drawing) {
  drawing.forEachSequence(seq => {
    seq.forEachBase((b: Base, p: number) => {
      if (b.numbering) {
        let ona = seq.outerNormalAngleAtPosition(p);
        let ina = ona + Math.PI;
        let cna = normalizeAngle(seq.clockwiseNormalAngleAtPosition(p));
        let a3 = cna - (Math.PI / 2);
        if (seq.length > p) {
          let b3 = seq.getBaseAtPosition(p + 1) as Base;
          a3 = b.angleBetweenCenters(b3);
        }
        if (!anglesAreClose(cna, a3 + (Math.PI / 2)) || !anglesAreClose(b.numbering.lineAngle, ina)) {
          b.numbering.lineAngle = ona;
        }
      }
    });
  });
  drawing.forEachSecondaryBond(sb => {
    let b1 = sb.base1;
    let b2 = sb.base2;
    let ba12 = b1.angleBetweenCenters(b2);
    let ba21 = b2.angleBetweenCenters(b1);
    if (b1.numbering) {
      let la = normalizeAngle(b1.numbering.lineAngle, ba12) - ba12;
      if (la < Math.PI / 4 || la > 7 * Math.PI / 4) {
        b1.numbering.lineAngle = b1.numbering.lineAngle + Math.PI;
      }
    }
    if (b2.numbering) {
      let la = normalizeAngle(b2.numbering.lineAngle, ba21) - ba21;
      if (la < Math.PI / 4 || la > 7 * Math.PI / 4) {
        b2.numbering.lineAngle = b2.numbering.lineAngle + Math.PI;
      }
    }
  });
}

export default adjustBaseNumbering;
