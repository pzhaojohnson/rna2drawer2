import { stemsAreEqual } from './stemsAreEqual';

test('stemsAreEqual function', () => {
  // are equal
  expect(stemsAreEqual(
    { position5: 12, position3: 31, size: 6 },
    { position5: 12, position3: 31, size: 6 },
  )).toBeTruthy();

  // different 5' most positions
  expect(stemsAreEqual(
    { position5: 12, position3: 31, size: 6 },
    { position5: 11, position3: 31, size: 6 },
  )).toBeFalsy();

  // different 3' most positions
  expect(stemsAreEqual(
    { position5: 12, position3: 32, size: 6 },
    { position5: 12, position3: 31, size: 6 },
  )).toBeFalsy();

  // different sizes
  expect(stemsAreEqual(
    { position5: 12, position3: 31, size: 6 },
    { position5: 12, position3: 31, size: 5 },
  )).toBeFalsy();
});
