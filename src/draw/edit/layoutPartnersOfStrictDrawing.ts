import { StrictDrawingInterface as StrictDrawing } from '../StrictDrawingInterface';
import { Partners } from 'Partners/Partners';
import { DrawingInterface as Drawing } from '../DrawingInterface';
import { pair } from 'Partners/edit';
import { hasKnots } from 'Partners/hasKnots';
import { removeKnots } from 'Partners/removeKnots';

function _idsToPositions(drawing: Drawing): { [id: string]: number } {
  let dict = {} as { [id: string]: number };
  drawing.forEachBase((b, p) => {
    dict[b.id] = p;
  });
  return dict;
}

function _overallSecondaryPartners(drawing: Drawing) {
  let idsToPositions = _idsToPositions(drawing);
  let partners: Partners = [];
  drawing.forEachBase(() => {
    partners.push(null);
  });
  drawing.forEachSecondaryBond(sb => {
    let p1 = idsToPositions[sb.base1.id];
    let p2 = idsToPositions[sb.base2.id];
    pair(partners, p1, p2);
  });
  return partners;
}

/**
 * The returned partners notation will be knotless, even if the
 * secondary bonds of the drawing form knots.
 *
 * This function also handles secondary bonds that share bases,
 * though it is undefined which pair of two overlapping pairs will
 * be included in the returned partners notation.
 */
function layoutPartnersOfStrictDrawing(sd: StrictDrawing): Partners {
  let partners = _overallSecondaryPartners(sd.drawing);
  if (hasKnots(partners)) {
    partners = removeKnots(partners);
  }
  return partners;
}

export default layoutPartnersOfStrictDrawing;
