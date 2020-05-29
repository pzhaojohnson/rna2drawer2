import areComplementary from './areComplementary';

it('handles lower case characters', () => {
  expect(areComplementary('augc', 'gcau')).toBeTruthy();
});

it('a match with every possible pair', () => {
  expect(areComplementary(
    'AAUUGGGCTT',
    'GAGTUCGATU',
  )).toBeTruthy();
});

it('complementary but length mismatch', () => {
  expect(areComplementary('AAA', 'UU')).toBeFalsy();
});

it('lengths of zero', () => {
  expect(areComplementary('', '')).toBeFalsy();
});

it('some mismatches', () => {
  expect(areComplementary('AUGC', 'GCUU')).toBeFalsy();
  expect(areComplementary('A', 'C')).toBeFalsy();
  expect(areComplementary('GGGGGG', 'CCCGCC')).toBeFalsy();
});

it('handles unrecognized characters', () => {
  expect(areComplementary('zxc', 'qwe')).toBeFalsy();
  expect(areComplementary('qwer', 'asdf')).toBeFalsy();
});
