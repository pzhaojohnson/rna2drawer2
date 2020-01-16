import containsTertiaryPairings from './containsTertiaryPairings';

it('containsTertiaryPairings', () => {
  expect(containsTertiaryPairings('((((....))))')).toBeFalsy();

  expect(containsTertiaryPairings('((([[[)))]]]')).toBeTruthy();
  expect(containsTertiaryPairings('((({{{)))}}}')).toBeTruthy();
  expect(containsTertiaryPairings('(((<<<)))>>>')).toBeTruthy();

  // empty
  expect(containsTertiaryPairings('')).toBeFalsy();
});
