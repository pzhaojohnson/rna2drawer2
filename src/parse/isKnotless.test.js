import isKnotless from './isKnotless';
import validatePartners from './validatePartners';

let knotlessCases = [

  // empty
  [],

  // unstructured
  [null, null, null, null],

  // a hairpin
  [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],

  // an internal loop
  [null, 15, 14, null, 13, 12, 11, null, null, null, 7, 6, 5, 3, 2, null, null],

  // a multibranch loop
  [23, 22, 21, null, 10, 9, null, null, 6, 5, 20, 19, 18, null, null, null, null, 13, 12, 11, 3, 2, 1]
];

let knottedCases = [

  // in front of hairpin
  [null, 12, 11, 10, null, 15, 14, 13, null, 4, 3, 2, 8, 7, 6, null],

  // behind hairpin
  [10, 9, 8, 15, 14, 13, null, 3, 2, 1, null, null, 6, 5, 4],

  // across hairpin
  [19, 18, 17, null, 13, 12, 11, null, null, null, 7, 6, 5, 21, 20, null, 3, 2, 1, 15, 14]
];

it('validate cases', () => {
  knotlessCases.forEach(cs => validatePartners(cs));
  knottedCases.forEach(cs => validatePartners(cs));
})

it('knotless', () => {
  knotlessCases.forEach(cs => expect(isKnotless(cs)).toBeTruthy());
});

it('knotted', () => {
  knottedCases.forEach(cs => expect(isKnotless(cs)).toBeFalsy());
});

export {
  knotlessCases,
  knottedCases
};
