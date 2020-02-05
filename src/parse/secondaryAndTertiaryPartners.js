/**
 * @typedef {object} SecondaryAndTertiaryPartners 
 * @property {Array<number|null>} secondaryPartners The partners notation of the secondary structure.
 * @property {Array<number|null>} tertiaryPartners The partners notation of the tertiary structure.
 */

/**
 * .
 * 
 * The partners notation of the secondary structure will not contain any knots,
 * while the partners notation of the tertiary structure may contain knots.
 * 
 * @param {Array<number|null>} bothPartners The partners notation containing both secondary and tertiary pairs.
 * 
 * @returns {SecondaryAndTertiaryPartners} 
 */
function secondaryAndTertiaryPartners(bothPartners) {

  // the partners notation of the secondary structure
  let secondaryPartners = [];

  // the partners notation of the tertiary structure
  let tertiaryPartners = [];

  // initialize with all nulls
  bothPartners.forEach(p => {
    secondaryPartners.push(null);
    tertiaryPartners.push(null);
  });

  // the stack of upstream partners
  let ups = [];

  /**
   * @param {number} p The position to be removed from ups.
   */
  function removeUp(p) {
    let i = ups.findIndex(e => e === p);
    ups.splice(i, 1);
  }

  /**
   * @param {Array<number|null>} partners The partners notation to add the pair to.
   * @param {number} p A position of the pair.
   * @param {number} q The other position of the pair.
   */
  function addPair(partners, p, q) {
    partners[p - 1] = q;
    partners[q - 1] = p;
  }

  /**
   * @param {number} p A position of the pair.
   * @param {number} q The other position of the pair.
   * 
   * @returns {number} The number of pairs that are knotted with the given pair.
   */
  function numKnottedPairs(p, q) {
    let u = Math.min(p, q);
    let d = Math.max(p, q);
    let ct = 0;
    
    for (let r = u + 1; r < d; r++) {
      let s = bothPartners[r - 1];
      
      if (s !== null) {
        if (s < u || s > d) {
          ct++;
        }
      }
    }
    
    return ct;
  }

  /**
   * @param {number} d The position of the downstream partner to handle.
   */
  function handleDown(d) {

    // the position of the upstream parter
    let u = bothPartners[d - 1];

    // the pair whose upstream partner is at the top of ups
    let p = ups[ups.length - 1];
    let q = bothPartners[p - 1];

    if (!ups.includes(u)) {
      // u and d pair has already been added
    } else if (u === p) {
      addPair(secondaryPartners, u, d);
      ups.pop();
    } else if (numKnottedPairs(u, d) > numKnottedPairs(p, q)) {
      addPair(tertiaryPartners, u, d);
      removeUp(u);
    } else {
      while (ups[ups.length - 1] !== u) {
        let r = ups.pop();
        let s = bothPartners[r - 1];
        addPair(tertiaryPartners, r, s);
      }

      addPair(secondaryPartners, u, d);
      ups.pop();
    }
  }

  for (let p = 1; p <= bothPartners.length; p++) {
    let q = bothPartners[p - 1];

    if (q === null) {
      // nothing to do
    } else if (p < q) {
      ups.push(p);
    } else {
      handleDown(p);
    }
  }

  return {
    secondaryPartners: secondaryPartners,
    tertiaryPartners: tertiaryPartners,
  };
}

export default secondaryAndTertiaryPartners;
