import splitSecondaryAndTertiaryPairs from './splitSecondaryAndTertiaryPairs';
import validatePartners from './validatePartners';

/**
 * @param {number} length 
 * 
 * @returns {Array<number|null>} Partners notation of the given length containing no pairs.
 */
function unstructuredPartners(length) {
  let partners = [];

  for (let i = 0; i < length; i++) {
    partners.push(null);
  }

  return partners;
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

let cases = [];

// empty
cases.push({
  allPartners: [],
  secondaryPartners: [],
  tertiaryPartners: [],
});

// unstructured
cases.push({
  allPartners: unstructuredPartners(3),
  secondaryPartners: unstructuredPartners(3),
  tertiaryPartners: unstructuredPartners(3),
});

// a hairpin
let allPartners = unstructuredPartners(9);
addPair(allPartners, 1, 9);
addPair(allPartners, 2, 8);
addPair(allPartners, 3, 7);

cases.push({
  allPartners: allPartners,
  secondaryPartners: [...allPartners],
  tertiaryPartners: unstructuredPartners(9),
});

// an internal loop
allPartners = unstructuredPartners(18);
addPair(allPartners, 2, 16);
addPair(allPartners, 3, 15);
addPair(allPartners, 5, 14);
addPair(allPartners, 6, 13);
addPair(allPartners, 7, 12);

cases.push({
  allPartners: allPartners,
  secondaryPartners: [...allPartners],
  tertiaryPartners: unstructuredPartners(18),
});

// a multibranch loop
allPartners = unstructuredPartners(23);
addPair(allPartners, 1, 21);
addPair(allPartners, 2, 20);
addPair(allPartners, 3, 19);
addPair(allPartners, 4, 10);
addPair(allPartners, 5, 9);
addPair(allPartners, 12, 18);
addPair(allPartners, 13, 17);

cases.push({
  allPartners: allPartners,
  secondaryPartners: [...allPartners],
  tertiaryPartners: unstructuredPartners(23),
});

// a 5' outer pseudoknot

allPartners = unstructuredPartners(17);
let secondaryPartners = [...allPartners];
let tertiaryPartners = [...allPartners];

addPair(allPartners, 2, 9);
addPair(secondaryPartners, 2, 9);
addPair(allPartners, 3, 8);
addPair(secondaryPartners, 3, 8);
addPair(allPartners, 4, 7);
addPair(secondaryPartners, 4, 7);

addPair(allPartners, 5, 15);
addPair(tertiaryPartners, 5, 15);
addPair(allPartners, 6, 14);
addPair(tertiaryPartners, 6, 14);

cases.push({
  allPartners: allPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

// a 3' outer pseudoknot

allPartners = unstructuredPartners(18);
secondaryPartners = [...allPartners];
tertiaryPartners = [...allPartners];

addPair(allPartners, 1, 12);
addPair(secondaryPartners, 1, 12);
addPair(allPartners, 2, 11);
addPair(secondaryPartners, 2, 11);
addPair(allPartners, 3, 10);
addPair(secondaryPartners, 3, 10);
addPair(allPartners, 4, 9);
addPair(secondaryPartners, 4, 9);

addPair(allPartners, 6, 17);
addPair(tertiaryPartners, 6, 17);
addPair(allPartners, 7, 16);
addPair(tertiaryPartners, 7, 16);
addPair(allPartners, 8, 15);
addPair(tertiaryPartners, 8, 15);

cases.push({
  allPartners: allPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
}),

// a pseudoknot between internal loops

allPartners = unstructuredPartners(25);
secondaryPartners = [...allPartners];
tertiaryPartners = [...allPartners];

addPair(allPartners, 2, 25);
addPair(secondaryPartners, 2, 25);
addPair(allPartners, 3, 24);
addPair(secondaryPartners, 3, 24);
addPair(allPartners, 4, 23);
addPair(secondaryPartners, 4, 23);
addPair(allPartners, 7, 21);
addPair(secondaryPartners, 7, 21);
addPair(allPartners, 8, 20);
addPair(secondaryPartners, 8, 20);
addPair(allPartners, 9, 19);
addPair(secondaryPartners, 9, 19);
addPair(allPartners, 12, 17);
addPair(secondaryPartners, 12, 17);
addPair(allPartners, 13, 16);
addPair(secondaryPartners, 13, 16);

addPair(allPartners, 5, 11);
addPair(tertiaryPartners, 5, 11);
addPair(allPartners, 6, 10);
addPair(tertiaryPartners, 6, 10);

cases.push({
  allPartners: allPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

// a pseudoknot of size one between internal loops

allPartners = unstructuredPartners(25);
secondaryPartners = [...allPartners];
tertiaryPartners = [...allPartners];

addPair(allPartners, 2, 25);
addPair(secondaryPartners, 2, 25);
addPair(allPartners, 3, 24);
addPair(secondaryPartners, 3, 24);
addPair(allPartners, 4, 23);
addPair(secondaryPartners, 4, 23);
addPair(allPartners, 7, 21);
addPair(secondaryPartners, 7, 21);
addPair(allPartners, 8, 20);
addPair(secondaryPartners, 8, 20);
addPair(allPartners, 9, 19);
addPair(secondaryPartners, 9, 19);
addPair(allPartners, 12, 17);
addPair(secondaryPartners, 12, 17);
addPair(allPartners, 13, 16);
addPair(secondaryPartners, 13, 16);

addPair(allPartners, 5, 11);
addPair(tertiaryPartners, 5, 11);

cases.push({
  allPartners: allPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

// intertwined pseudoknots

allPartners = unstructuredPartners(32);
secondaryPartners = [...allPartners];
tertiaryPartners = [...allPartners];

addPair(allPartners, 2, 25);
addPair(secondaryPartners, 2, 25);
addPair(allPartners, 3, 24);
addPair(secondaryPartners, 3, 24);
addPair(allPartners, 4, 23);
addPair(secondaryPartners, 4, 23);
addPair(allPartners, 7, 21);
addPair(secondaryPartners, 7, 21);
addPair(allPartners, 8, 20);
addPair(secondaryPartners, 8, 20);
addPair(allPartners, 9, 19);
addPair(secondaryPartners, 9, 19);
addPair(allPartners, 12, 17);
addPair(secondaryPartners, 12, 17);
addPair(allPartners, 13, 16);
addPair(secondaryPartners, 13, 16);

addPair(allPartners, 5, 15);
addPair(tertiaryPartners, 5, 15);
addPair(allPartners, 6, 14);
addPair(tertiaryPartners, 6, 14);
addPair(allPartners, 10, 29);
addPair(tertiaryPartners, 10, 29);
addPair(allPartners, 11, 28);
addPair(tertiaryPartners, 11, 28);

cases.push({
  allPartners: allPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

it('splitSecondaryAndTertiaryPairs', () => {
  cases.forEach(cs => {

    // validate manually generated partners notation
    validatePartners(cs.allPartners);
    validatePartners(cs.secondaryPartners);
    expect(cs.secondaryPartners.length).toBe(cs.allPartners.length);
    validatePartners(cs.tertiaryPartners);
    expect(cs.tertiaryPartners.length).toBe(cs.allPartners.length);

    let result = splitSecondaryAndTertiaryPairs(cs.allPartners);

    expect(result.secondaryPartners.length).toBe(cs.allPartners.length);
    expect(result.tertiaryPartners.length).toBe(cs.allPartners.length);

    for (let p = 1; p <= cs.allPartners.length; p++) {
      expect(result.secondaryPartners[p - 1]).toBe(cs.secondaryPartners[p - 1]);
      expect(result.tertiaryPartners[p - 1]).toBe(cs.tertiaryPartners[p - 1]);
    }
  });
});
