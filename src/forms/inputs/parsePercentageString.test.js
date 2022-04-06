import { parsePercentageString } from './parsePercentageString';

test('parsePercentageString function', () => {
  // no decimal places
  expect(parsePercentageString('100%')).toBeCloseTo(1, 6);
  expect(parsePercentageString('100')).toBeCloseTo(1, 6);
  expect(parsePercentageString('0%')).toBeCloseTo(0, 6);
  expect(parsePercentageString('0')).toBeCloseTo(0, 6);
  expect(parsePercentageString('55%')).toBeCloseTo(0.55, 6);
  expect(parsePercentageString('55')).toBeCloseTo(0.55, 6);

  // decimal places
  expect(parsePercentageString('32.08%')).toBeCloseTo(0.3208, 6);
  expect(parsePercentageString('32.08')).toBeCloseTo(0.3208, 6);
  expect(parsePercentageString('0.1%')).toBeCloseTo(0.001, 6);
  expect(parsePercentageString('0.1')).toBeCloseTo(0.001, 6);

  // extra whitespace
  expect(parsePercentageString('   29%')).toBeCloseTo(0.29, 6);
  expect(parsePercentageString('   29')).toBeCloseTo(0.29, 6);
  expect(parsePercentageString('38.5%   ')).toBeCloseTo(0.385, 6);
  expect(parsePercentageString('38.5   ')).toBeCloseTo(0.385, 6);
  expect(parsePercentageString('12   %')).toBeCloseTo(0.12, 6);
  expect(parsePercentageString('12   ')).toBeCloseTo(0.12, 6);

  // nonfinite
  expect(parsePercentageString('Infinity%')).toBe(Infinity);
  expect(parsePercentageString('Infinity')).toBe(Infinity);
  expect(parsePercentageString('-Infinity%')).toBe(-Infinity);
  expect(parsePercentageString('-Infinity')).toBe(-Infinity);
  expect(parsePercentageString('NaN%')).toBe(NaN);
  expect(parsePercentageString('NaN')).toBe(NaN);

  // blank
  expect(parsePercentageString('')).toBe(NaN);
  expect(parsePercentageString('     ')).toBe(NaN);

  // nonnumeric
  expect(parsePercentageString('asdf')).toBe(NaN);
  expect(parsePercentageString('Q')).toBe(NaN);
});
