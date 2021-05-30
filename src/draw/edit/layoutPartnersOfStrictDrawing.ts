import { StrictDrawingInterface as StrictDrawing } from '../StrictDrawingInterface';
import { DrawingInterface as Drawing } from '../DrawingInterface';
import splitSecondaryAndTertiaryPairs from '../../parse/splitSecondaryAndTertiaryPairs';

function _idsToPositions(drawing: Drawing): { [id: string]: number } {
  let dict = {} as { [id: string]: number };
  drawing.forEachBase((b, p) => {
    dict[b.id] = p;
  });
  return dict;
}

function _overallSecondaryPartners(drawing: Drawing) {
  let idsToPositions = _idsToPositions(drawing);
  let partners = [] as (number | null)[];
  drawing.forEachBase(() => {
    partners.push(null);
  });
  drawing.forEachSecondaryBond(sb => {
    let p1 = idsToPositions[sb.base1.id];
    let p2 = idsToPositions[sb.base2.id];
    partners[p1 - 1] = p2;
    partners[p2 - 1] = p1;
  });
  return partners;
}

function _removeKnots(partners: (number | null)[]) {
  return splitSecondaryAndTertiaryPairs(partners).secondaryPartners;
}

/**
 * The returned partners notation will be knotless, even if the
 * secondary bonds of the drawing form knots.
 *
 * This function also handles secondary bonds that share bases,
 * though it is undefined which pair of two overlapping pairs will
 * be included in the returned partners notation.
 */
function layoutPartnersOfStrictDrawing(sd: StrictDrawing): (number | null)[] {
  let partners = _overallSecondaryPartners(sd.drawing);
  return _removeKnots(partners);
}

export default layoutPartnersOfStrictDrawing;
