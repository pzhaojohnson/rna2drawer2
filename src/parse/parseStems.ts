export interface StemDescription {
  start: number; // the 5' most position of the stem
  end: number; // the 3' most position of the stem
  size: number; // the number of base pairs in the stem
}

/**
 * Stem descriptions are not guaranteed to be returned in any particular order.
 * 
 * This function can handle knotted structures.
 */
function parseStems(partners: (number | null)[]): StemDescription[] {
  let stems = [];
  let p = 1;

  while (p <= partners.length) {
    let q = partners[p - 1];
    
    if (q != null && p < q) {
      let size = 1;

      // checking p + 1 < q - 1 handles hairpins with loops of size zero
      while (partners[p] === q - 1 && p + 1 < q - 1) {
        p++;
        q--;
        size++;
      }

      stems.push({
        start: p - size + 1,
        end: q + size - 1,
        size: size
      });
    }

    p++;
  }

  return stems;
}

export default parseStems;
