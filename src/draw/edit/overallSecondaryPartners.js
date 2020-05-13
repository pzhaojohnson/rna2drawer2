function _idsToPositions(drawing) {
  let dict = {};
  drawing.forEachBase((b, p) => {
    dict[b.id] = p;
  });
  return dict;
}

/**
 * It is undefined what this function returns if secondary bonds
 * in the drawing share bases.
 * 
 * @param {Drawing} drawing 
 * 
 * @returns {Array<number|null>} 
 */
function overallSecondaryPartners(drawing) {
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

export default overallSecondaryPartners;
