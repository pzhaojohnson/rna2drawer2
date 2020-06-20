export interface SecondaryAndTertiaryPartners {
  secondaryPartners: (number | null)[];
  tertiaryPartners: (number | null)[];
}

/**
 * Splits the given partners notation into secondary and tertiary partners notations.
 * 
 * The partners notation of the secondary structure won't contain any knots,
 * while the partners notation of the tertiary structure may contain knots.
 */
function splitSecondaryAndTertiaryPairs(allPartners: (number | null)[]): SecondaryAndTertiaryPartners {

  // the partners notation of the secondary structure
  let secondaryPartners = [] as (number | null)[];

  // the partners notation of the tertiary structure
  let tertiaryPartners = [] as (number | null)[];

  // initialize with all nulls
  allPartners.forEach(p => {
    secondaryPartners.push(null);
    tertiaryPartners.push(null);
  });

  // the stack of upstream partners
  let ups = [] as number[];

  /**
   * @param {number} p The position to be removed from ups.
   */
  function removeUp(p: number) {
    let i = ups.findIndex(e => e === p);
    ups.splice(i, 1);
  }

  function addPair(partners: (number | null)[], p: number, q: number) {
    partners[p - 1] = q;
    partners[q - 1] = p;
  }

  /**
   * Returns the number of pairs that are knotted with the given pair.
   */
  function numKnottedPairs(p: number, q: number): number {
    let u = Math.min(p, q);
    let d = Math.max(p, q);
    let ct = 0;
    
    for (let r = u + 1; r < d; r++) {
      let s = allPartners[r - 1];
      
      if (s !== null) {
        if (s < u || s > d) {
          ct++;
        }
      }
    }
    
    return ct;
  }

  /**
   * d is the position of the downstream partner to handle.
   */
  function handleDown(d: number) {

    // the position of the upstream parter
    let u = allPartners[d - 1] as number;

    // the pair whose upstream partner is at the top of ups
    let p = ups[ups.length - 1];
    let q = allPartners[p - 1] as number;

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
        let r = ups.pop() as number;
        let s = allPartners[r - 1] as number;
        addPair(tertiaryPartners, r, s);
      }

      addPair(secondaryPartners, u, d);
      ups.pop();
    }
  }

  for (let p = 1; p <= allPartners.length; p++) {
    let q = allPartners[p - 1];

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

export default splitSecondaryAndTertiaryPairs;
