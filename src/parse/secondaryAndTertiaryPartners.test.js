import secondaryAndTertiaryPartners from './secondaryAndTertiaryPartners';
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
  bothPartners: [],
  secondaryPartners: [],
  tertiaryPartners: [],
});

// unstructured
cases.push({
  bothPartners: unstructuredPartners(3),
  secondaryPartners: unstructuredPartners(3),
  tertiaryPartners: unstructuredPartners(3),
});

// a hairpin
let bothPartners = unstructuredPartners(9);
addPair(bothPartners, 1, 9);
addPair(bothPartners, 2, 8);
addPair(bothPartners, 3, 7);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: [...bothPartners],
  tertiaryPartners: unstructuredPartners(9),
});

// an internal loop
bothPartners = unstructuredPartners(18);
addPair(bothPartners, 2, 16);
addPair(bothPartners, 3, 15);
addPair(bothPartners, 5, 14);
addPair(bothPartners, 6, 13);
addPair(bothPartners, 7, 12);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: [...bothPartners],
  tertiaryPartners: unstructuredPartners(18),
});

// a multibranch loop
bothPartners = unstructuredPartners(23);
addPair(bothPartners, 1, 21);
addPair(bothPartners, 2, 20);
addPair(bothPartners, 3, 19);
addPair(bothPartners, 4, 10);
addPair(bothPartners, 5, 9);
addPair(bothPartners, 12, 18);
addPair(bothPartners, 13, 17);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: [...bothPartners],
  tertiaryPartners: unstructuredPartners(23),
});

// a 5' outer pseudoknot

bothPartners = unstructuredPartners(17);
let secondaryPartners = [...bothPartners];
let tertiaryPartners = [...bothPartners];

addPair(bothPartners, 2, 9);
addPair(secondaryPartners, 2, 9);
addPair(bothPartners, 3, 8);
addPair(secondaryPartners, 3, 8);
addPair(bothPartners, 4, 7);
addPair(secondaryPartners, 4, 7);

addPair(bothPartners, 5, 15);
addPair(tertiaryPartners, 5, 15);
addPair(bothPartners, 6, 14);
addPair(tertiaryPartners, 6, 14);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

// a 3' outer pseudoknot

bothPartners = unstructuredPartners(18);
secondaryPartners = [...bothPartners];
tertiaryPartners = [...bothPartners];

addPair(bothPartners, 1, 12);
addPair(secondaryPartners, 1, 12);
addPair(bothPartners, 2, 11);
addPair(secondaryPartners, 2, 11);
addPair(bothPartners, 3, 10);
addPair(secondaryPartners, 3, 10);
addPair(bothPartners, 4, 9);
addPair(secondaryPartners, 4, 9);

addPair(bothPartners, 6, 17);
addPair(tertiaryPartners, 6, 17);
addPair(bothPartners, 7, 16);
addPair(tertiaryPartners, 7, 16);
addPair(bothPartners, 8, 15);
addPair(tertiaryPartners, 8, 15);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
}),

// a pseudoknot between internal loops

bothPartners = unstructuredPartners(25);
secondaryPartners = [...bothPartners];
tertiaryPartners = [...bothPartners];

addPair(bothPartners, 2, 25);
addPair(secondaryPartners, 2, 25);
addPair(bothPartners, 3, 24);
addPair(secondaryPartners, 3, 24);
addPair(bothPartners, 4, 23);
addPair(secondaryPartners, 4, 23);
addPair(bothPartners, 7, 21);
addPair(secondaryPartners, 7, 21);
addPair(bothPartners, 8, 20);
addPair(secondaryPartners, 8, 20);
addPair(bothPartners, 9, 19);
addPair(secondaryPartners, 9, 19);
addPair(bothPartners, 12, 17);
addPair(secondaryPartners, 12, 17);
addPair(bothPartners, 13, 16);
addPair(secondaryPartners, 13, 16);

addPair(bothPartners, 5, 11);
addPair(tertiaryPartners, 5, 11);
addPair(bothPartners, 6, 10);
addPair(tertiaryPartners, 6, 10);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

// a pseudoknot of size one between internal loops

bothPartners = unstructuredPartners(25);
secondaryPartners = [...bothPartners];
tertiaryPartners = [...bothPartners];

addPair(bothPartners, 2, 25);
addPair(secondaryPartners, 2, 25);
addPair(bothPartners, 3, 24);
addPair(secondaryPartners, 3, 24);
addPair(bothPartners, 4, 23);
addPair(secondaryPartners, 4, 23);
addPair(bothPartners, 7, 21);
addPair(secondaryPartners, 7, 21);
addPair(bothPartners, 8, 20);
addPair(secondaryPartners, 8, 20);
addPair(bothPartners, 9, 19);
addPair(secondaryPartners, 9, 19);
addPair(bothPartners, 12, 17);
addPair(secondaryPartners, 12, 17);
addPair(bothPartners, 13, 16);
addPair(secondaryPartners, 13, 16);

addPair(bothPartners, 5, 11);
addPair(tertiaryPartners, 5, 11);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

// intertwined pseudoknots

bothPartners = unstructuredPartners(32);
secondaryPartners = [...bothPartners];
tertiaryPartners = [...bothPartners];

addPair(bothPartners, 2, 25);
addPair(secondaryPartners, 2, 25);
addPair(bothPartners, 3, 24);
addPair(secondaryPartners, 3, 24);
addPair(bothPartners, 4, 23);
addPair(secondaryPartners, 4, 23);
addPair(bothPartners, 7, 21);
addPair(secondaryPartners, 7, 21);
addPair(bothPartners, 8, 20);
addPair(secondaryPartners, 8, 20);
addPair(bothPartners, 9, 19);
addPair(secondaryPartners, 9, 19);
addPair(bothPartners, 12, 17);
addPair(secondaryPartners, 12, 17);
addPair(bothPartners, 13, 16);
addPair(secondaryPartners, 13, 16);

addPair(bothPartners, 5, 15);
addPair(tertiaryPartners, 5, 15);
addPair(bothPartners, 6, 14);
addPair(tertiaryPartners, 6, 14);
addPair(bothPartners, 10, 29);
addPair(tertiaryPartners, 10, 29);
addPair(bothPartners, 11, 28);
addPair(tertiaryPartners, 11, 28);

cases.push({
  bothPartners: bothPartners,
  secondaryPartners: secondaryPartners,
  tertiaryPartners: tertiaryPartners,
});

it('secondaryAndTertiaryPartners', () => {
  cases.forEach(cs => {

    // validate manually generated partners notation
    validatePartners(cs.bothPartners);
    validatePartners(cs.secondaryPartners);
    expect(cs.secondaryPartners.length).toBe(cs.bothPartners.length);
    validatePartners(cs.tertiaryPartners);
    expect(cs.tertiaryPartners.length).toBe(cs.bothPartners.length);

    let result = secondaryAndTertiaryPartners(cs.bothPartners);

    expect(result.secondaryPartners.length).toBe(cs.bothPartners.length);
    expect(result.tertiaryPartners.length).toBe(cs.bothPartners.length);

    for (let p = 1; p <= cs.bothPartners.length; p++) {
      expect(result.secondaryPartners[p - 1]).toBe(cs.secondaryPartners[p - 1]);
      expect(result.tertiaryPartners[p - 1]).toBe(cs.tertiaryPartners[p - 1]);
    }
  });
});
