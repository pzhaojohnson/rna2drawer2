/**
 * Returns true if the given partners notation contains no knots.
 */
function isKnotless(partners: (number | null)[]): boolean {
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
