import secondaryAndTertiaryPartners from '../../parse/secondaryAndTertiaryPartners';

function _idsToPositions(drawing) {
  let dict = {};
  drawing.forEachBase((b, p) => {
    dict[b.id] = p;
  });
  return dict;
}

function _overallSecondaryPartners(drawing) {
  let idsToPositions = _idsToPositions(drawing);
  let partners = [];
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

function _removeKnots(partners) {
  return secondaryAndTertiaryPartners(partners).secondaryPartners;
}

/**
 * The returned partners notation will be knotless, even if the
 * secondary bonds of the drawing form knots.
 * 
 * This function also handles secondary bonds that share bases,
 * though it is undefined which pair of two overlapping pairs will
 * be included in the returned partners notation.
 * 
 * @param {StrictDrawing} sd 
 * 
 * @returns {Array<number|null>} 
 */
function layoutPartnersOfStrictDrawing(sd) {
  let partners = _overallSecondaryPartners(sd.drawing);
  return _removeKnots(partners);
}

export default layoutPartnersOfStrictDrawing;
