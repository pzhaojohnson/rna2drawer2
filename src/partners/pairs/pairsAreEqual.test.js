import { pairsAreEqual } from './pairsAreEqual';

test('pairsAreEqual function', () => {
  // are equal (despite varying partners orders)
  expect(pairsAreEqual([30, 62], [30, 62])).toBeTruthy();
  expect(pairsAreEqual([62, 30], [30, 62])).toBeTruthy();
  expect(pairsAreEqual([30, 62], [62, 30])).toBeTruthy();
  expect(pairsAreEqual([62, 30], [62, 30])).toBeTruthy();

  // different upstream partners
  expect(pairsAreEqual([19, 33], [20, 33])).toBeFalsy();

  // different downstream partners
  expect(pairsAreEqual([5, 12], [5, 11])).toBeFalsy();

  // different upstream and downstream partners
  expect(pairsAreEqual([2, 100], [50, 60])).toBeFalsy();
});
