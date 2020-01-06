import closeToEachOther from './closeToEachOther';

it('closeToEachOther', () => {

  // less than maxDiff
  expect(closeToEachOther(1.1111, 1.1112, 0.001)).toBeTruthy();

  // more than maxDiff
  expect(closeToEachOther(1.111, 1.1121, 0.001)).toBeFalsy();

  // x is greater than y
  expect(closeToEachOther(1.1112, 1.1111, 0.001)).toBeTruthy();

  // negative numbers
  expect(closeToEachOther(-1.1112, -1.1111, 0.001)).toBeTruthy();
});
