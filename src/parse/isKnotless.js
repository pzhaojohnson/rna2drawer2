/**
 * @param {Array<number|null>} partners The partners notation of a secondary structure.
 * 
 * @returns {boolean} True if the secondary structure contains no knots.
 */
function isKnotless(partners) {
  let upPartners = [];
  
  for (let p = 1; p <= partners.length; p++) {
    let q = partners[p - 1];
    
    if (q !== null) {
      if (p < q) {
        upPartners.push(p);
      } else {
        if (q !== upPartners.pop()) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export default isKnotless;
