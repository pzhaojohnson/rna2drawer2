import parseStems from './parseStems';
import validatePartners from '../draw/layout/singleseq/strict/validatePartners';

let cases = [

  // a hairpin
  {
    partners: [9, 8, 7, null, null, null, 3, 2, 1],
    stems: [
      { start: 1, end: 9, size: 3 },
    ],
  },

  // an internal loop
  {
    partners: [null, 16, 15, null, 14, 13, 12, null, null, null, null, 7, 6, 5, 3, 2, null],
    stems: [
      { start: 2, end: 16, size: 2 },
      { start: 5, end: 14, size: 3 },
    ],
  },

  // a multibranch loop
  {
    partners: [21, 20, 19, 10, 9, null, null, null, 5, 4, null, 18, 17, null, null, null, 13, 12, 3, 2, 1, null, null],
    stems: [
      { start: 1, end: 21, size: 3 },
      { start: 4, end: 10, size: 2 },
      { start: 12, end: 18, size: 2 },
    ],
  },

  // a 5' outer pseudoknot
  {
    partners: [null, 9, 8, 7, 15, 14, 4, 3, 2, null, null, null, null, 6, 5, null, null],
    stems: [
      { start: 5, end: 15, size: 2 },
      { start: 2, end: 9, size: 3 },
    ],
  },

  // a 3' outer pseudoknot
  {
    partners: [12, 11, 10, 9, null, 17, 16, 15, 4, 3, 2, 1, null, null, 8, 7, 6, null],
    stems: [
      { start: 1, end: 12, size: 4 },
      { start: 6, end: 17, size: 3 },
    ],
  },

  // an empty hairpin
  {
    partners: [null, 5, 4, 3, 2, null],
    stems: [
      { start: 2, end: 5, size: 2},
    ],
  },

  // stem of size one
  {
    partners: [null, 6, null, null, null, 2],
    stems: [
      { start: 2, end: 6, size: 1},
    ],
  },
];

it('parseStems', () => {

  // validate manually typed in partners notation
  cases.forEach(cs => {
    validatePartners(cs.partners);
    
    let stems = parseStems(cs.partners);
    expect(stems.length).toBe(cs.stems.length);

    cs.stems.forEach(est => {
      expect(stems.find(st => {
        return st.start === est.start
          && st.end === est.end
          && st.size === est.size;
      })).toBeTruthy();
    });
  });
});
