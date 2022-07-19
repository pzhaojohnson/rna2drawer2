import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { Partners } from 'Partners/Partners';
import type { Drawing } from 'Draw/Drawing';
import { pair } from 'Partners/edit';
import { isTree } from 'Partners/isTree';
import { treeify } from 'Partners/treeify';

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
  drawing.secondaryBonds.forEach(sb => {
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
  if (!isTree(partners)) {
    partners = treeify(partners);
  }
  return partners;
}

export default layoutPartnersOfStrictDrawing;
