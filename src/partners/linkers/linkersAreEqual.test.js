import { linkersAreEqual } from './linkersAreEqual';

test('linkersAreEqual function', () => {

  // are equal
  expect(linkersAreEqual(
    { boundingPosition5: 60, boundingPosition3: 81 },
    { boundingPosition5: 60, boundingPosition3: 81 },
  )).toBeTruthy();

  // different upstream bounding positions
  expect(linkersAreEqual(
    { boundingPosition5: 61, boundingPosition3: 81 },
    { boundingPosition5: 60, boundingPosition3: 81 },
  )).toBeFalsy();

  // different downstream bounding positions
  expect(linkersAreEqual(
    { boundingPosition5: 60, boundingPosition3: 81 },
    { boundingPosition5: 60, boundingPosition3: 80 },
  )).toBeFalsy();
});
