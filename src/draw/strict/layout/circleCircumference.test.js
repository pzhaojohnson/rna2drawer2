import {
  circleCircumference,
  _oneStraightCircumference,
  _lowerBound,
  _upperBound,
  _estimateIsTooLow,
} from './circleCircumference';

it('_oneStraightCircumference', () => {
  let sl = 2 * (3 ** 0.5);
  let rpl = 4 * Math.PI / 3;
  expect(_oneStraightCircumference(sl, rpl)).toBeCloseTo(4 * Math.PI, 3);
});

it('_lowerBound', () => {
  expect(_lowerBound(2.5, 3, 7.8)).toBeCloseTo(15.3, 3);
});

it('_upperBound - numStraights is zero', () => {
  expect(_upperBound(4.3, 0, 12.5)).toBeCloseTo(12.5, 3);
});

it('_upperBound - straightLength is zero', () => {
  expect(_upperBound(0, 2, 3.74)).toBeCloseTo(3.74, 3);
});

it('_upperBound - straightLength is very small', () => {
  expect(_upperBound(0.00001, 3, 7.88)).toBeCloseTo(7.88, 3);
});

it('_upperBound - numStraights is one', () => {
  expect(
    _upperBound(2.8, 1, 16.5)
  ).toBeCloseTo(_oneStraightCircumference(2.8, 16.5));
});

it('_upperBound - numStraights is greater than one', () => {
  expect(_upperBound(2.5, 3, 6.5)).toBeCloseTo(14.762233295059758, 3);
});

it('_estimateIsTooLow - numStraights is zero', () => {
  expect(_estimateIsTooLow(4.3, 2, 0, 5.5)).toBeTruthy();
  expect(_estimateIsTooLow(5.7, 2, 0, 5)).toBeFalsy();
});

it('_estimateIsTooLow - straightLength is very small', () => {
  expect(_estimateIsTooLow(2.35, 0.00001, 3, 4.5)).toBeTruthy();
  expect(_estimateIsTooLow(7.6, 0.00001, 4, 5.4)).toBeFalsy();
});

it('_estimateIsTooLow - numStraights is one', () => {
  expect(
    _estimateIsTooLow(4.6, 2, 1, 5.5)
  ).toBe(4.6 < _oneStraightCircumference(2, 5.5));
});

it('_estimateIsTooLow - numStraights is greater than one', () => {
  expect(_estimateIsTooLow(12.5, 2, 2, 8.377580409572783)).toBeTruthy();
  expect(_estimateIsTooLow(12.6, 2, 2, 8.377580409572783)).toBeFalsy();
});

it('_estimateIsTooLow - remainingPolarLength is greater than estimate', () => {
  // and numStraights is greater than one
  expect(_estimateIsTooLow(8, 2, 2, 8.377580409572783)).toBeTruthy();
});

it('circleCircumference - numStraights is zero', () => {
  expect(circleCircumference(1.22, 0, 2.5)).toBeCloseTo(2.5, 3);
});

it('circleCircumference - straightLength is zero', () => {
  expect(circleCircumference(0, 3, 5.66)).toBeCloseTo(5.66, 3);
});

it('circleCircumference - straightLength is very small', () => {
  expect(circleCircumference(0.00001, 5, 0.88)).toBeCloseTo(0.88, 3);
});

it('circleCircumference - numStraights is one', () => {
  expect(
    circleCircumference(8.88, 1, 6.5)
  ).toBeCloseTo(_oneStraightCircumference(8.88, 6.5), 3);
});

it('circleCircumference - numStraights is greater than one', () => {
  expect(circleCircumference(2, 2, 8.377580409572783)).toBeCloseTo(4 * Math.PI, 3);
});

it('circleCircumference - large number of straights', () => {
  expect(
    circleCircumference(0.980171403295606, 12, 19.634954084936208)
  ).toBeCloseTo(10 * Math.PI, 3);
});

it('circleCircumference - most of length is straight', () => {
  // and numStraights is greater than one
  expect(circleCircumference(5.196152422706632, 2, 6.283185307179586)).toBeCloseTo(6 * Math.PI, 3);
});

it('circleCircumference - remainingPolarLength is zero', () => {
  // and numStraights is greater than one
  expect(circleCircumference(2.5, 2, 0)).toBeCloseTo(2.5 * Math.PI, 3);
});

it('circleCircumference - remainingPolarLength is very small', () => {
  // and numStraights is greater than one
  expect(circleCircumference(5, 2, 1e-6)).toBeCloseTo(5 * Math.PI, 3);
});
