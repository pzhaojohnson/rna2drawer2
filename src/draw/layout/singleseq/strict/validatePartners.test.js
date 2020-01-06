import validatePartners from './validatePartners';

it('valid', () => {

  // empty
  let ps = [];
  expect(() => validatePartners(ps)).not.toThrow();

  // unstructured
  ps = [null, null, null, null];
  expect(() => validatePartners(ps)).not.toThrow();

  // a hairpin
  ps = [9, 8, 7, null, null, null, 3, 2, 1];
  expect(() => validatePartners(ps)).not.toThrow();

  // a pseudoknot
  ps = [11, 10, 9, null, 14, 13, 12, null, 3, 2, 1, 7, 6, 5, null];
  expect(() => validatePartners(ps)).not.toThrow();
});

it('invalid', () => {

  // 5' null
  let ps = [9, 8, null, null, null, null, 3, 2, 1];
  expect(() => validatePartners(ps)).toThrow();

  // 3' null
  ps = [9, 8, 7, null, null, null, null, 2, 1];
  expect(() => validatePartners(ps)).toThrow();

  // mismatched
  ps = [9, 7, 8, null, null, null, 3, 2, 1];
  expect(() => validatePartners(ps)).toThrow();
});
