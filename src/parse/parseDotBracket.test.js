import parseDotBracket from './parseDotBracket';
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

let validCases = [

  // empty
  {
    dotBracket: '',
    allPartners: [],
    secondaryPartners: [],
    tertiaryPartners: [],
  },

  // unstructured
  {
    dotBracket: '....',
    allPartners: [null, null, null, null],
    secondaryPartners: [null, null, null, null],
    tertiaryPartners: [null, null, null, null],
  },

  // a hairpin
  {
    dotBracket: '((((....))))',
    allPartners: [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],
    secondaryPartners: [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],
    tertiaryPartners: unstructuredPartners(12),
  },

  // an internal loop
  {
    dotBracket: '.(((..((...))))).',
    allPartners: [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
    secondaryPartners: [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
    tertiaryPartners: unstructuredPartners(17),
  },

  // a multibranch loop
  {
    dotBracket: '((..(((..)))..((....)))).',
    allPartners: [24, 23, null, null, 12, 11, 10, null, null, 7, 6, 5, null, null, 22, 21, null, null, null, null, 16, 15, 2, 1, null],
    secondaryPartners: [24, 23, null, null, 12, 11, 10, null, null, 7, 6, 5, null, null, 22, 21, null, null, null, null, 16, 15, 2, 1, null],
    tertiaryPartners: unstructuredPartners(25),
  },

  // pseudoknots
  {
    dotBracket: '((([[[)))]]]',
    allPartners: [9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4],
    secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
    tertiaryPartners: [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  },
  {
    dotBracket: '((({{{)))}}}',
    allPartners: [9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4],
    secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
    tertiaryPartners: [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  },
  {
    dotBracket: '(((<<<)))>>>',
    allPartners: [9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4],
    secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
    tertiaryPartners: [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  },

  // knotted pseudoknots
  {
    dotBracket: '(((.[[[.))).{{{.]]].}}}.',
    allPartners: [11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },
  {
    dotBracket: '(((.[[[.))).<<<.]]].>>>.',
    allPartners: [11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },
  {
    dotBracket: '(((.<<<.))).{{{.>>>.}}}.',
    allPartners: [11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },

  // ignore whitespace
  {
    dotBracket: ' ((\t\t((. \n\r\t ..\t.))))',
    allPartners: [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],
    secondaryPartners: [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],
    tertiaryPartners: unstructuredPartners(12),
  },
  {
    dotBracket: '(((.  \t\t<<<\r\n  \r.))).{{{.\t\t>>>.}}}.',
    allPartners: [11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },

  // ignore non-dot-bracket characters
  {
    dotBracket: '.  #$%^&(((.queyweytqi.((...kon!@#))))).',
    allPartners: [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
    secondaryPartners: [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
    tertiaryPartners: unstructuredPartners(17),
  },
  {
    dotBracket: '(((.<<aa<.))weofk).{{{!@#$%.>>>.}}}.',
    allPartners: [11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },
];

let unmatchedPartnersCases = [
  
  // unmatched downstream partners
  { dotBracket: '((((....)))))' },
  { dotBracket: '((((....))))}' },
  { dotBracket: '(<((....))>))' },
  { dotBracket: '((..(((..))))..((....)))).' },
  { dotBracket: '((..(((..)))]..((....)))).' },
  { dotBracket: '(({[(((}.)))..((]]..)))).' },

  // unmatched upstream partners
  { dotBracket: '(((((....))))' },
  { dotBracket: '<((((....))))' },
  { dotBracket: '((..(((..)))..(((....)))).' },
  { dotBracket: '([..(((..)))..(((....)))).' },
];

it('valid cases', () => {
  validCases.forEach(cs => {
    let parsed = parseDotBracket(cs.dotBracket);

    // validate manually typed in partners notation
    validatePartners(cs.allPartners);
    validatePartners(cs.secondaryPartners);
    expect(cs.secondaryPartners.length).toBe(cs.allPartners.length);
    validatePartners(cs.tertiaryPartners);
    expect(cs.tertiaryPartners.length).toBe(cs.allPartners.length);

    for (let p = 1; p <= cs.allPartners.length; p++) {
      expect(parsed.allPartners[p - 1]).toBe(cs.allPartners[p - 1]);
      expect(parsed.secondaryPartners[p - 1]).toBe(cs.secondaryPartners[p - 1]);
      expect(parsed.tertiaryPartners[p - 1]).toBe(cs.tertiaryPartners[p - 1]);
    }
  });
});

it('unmatched partners cases', () => {
  unmatchedPartnersCases.forEach(cs => {
    expect(() => parseDotBracket(cs.dotBracket)).toThrow();
  });
});
