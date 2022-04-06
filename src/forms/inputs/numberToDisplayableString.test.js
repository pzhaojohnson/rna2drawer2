import { numberToDisplayableString } from './numberToDisplayableString';

describe('numberToDisplayableString function', () => {
  test('various numbers', () => {
    expect(numberToDisplayableString(0)).toBe('0');
    expect(numberToDisplayableString(1)).toBe('1');
    expect(numberToDisplayableString(-1)).toBe('-1');
    expect(numberToDisplayableString(17)).toBe('17');
    expect(numberToDisplayableString(-2580)).toBe('-2580');
    expect(numberToDisplayableString(5.1284)).toBe('5.1284');
    expect(numberToDisplayableString(0.0238)).toBe('0.0238');
    expect(numberToDisplayableString(-10.83852)).toBe('-10.83852');
  });

  test('rounding', () => {
    expect(numberToDisplayableString(5.48781, { places: 2 })).toBe('5.49'); // rounds up
    expect(numberToDisplayableString(3.191428, { places: 3 })).toBe('3.191'); // rounds down
    expect(numberToDisplayableString(8.28298, { places: 0 })).toBe('8'); // rounds to integer
    expect(numberToDisplayableString(0.248, { places: 0 })).toBe('0'); // rounds to zero
    expect(numberToDisplayableString(10, { places: 6 })).toBe('10'); // excess places
    expect(numberToDisplayableString(-4.1482, { places: 2 })).toBe('-4.15'); // negative number
  });

  test('undefined and null', () => {
    expect(numberToDisplayableString()).toBe('');
    expect(numberToDisplayableString(undefined)).toBe('');
    expect(numberToDisplayableString(null)).toBe('');

    // specifying decimal places to round to should have no effect
    expect(numberToDisplayableString(undefined, { places: 2 })).toBe('');
    expect(numberToDisplayableString(null, { places: 3 })).toBe('');
  });

  test('nonfinite numbers', () => {
    expect(numberToDisplayableString(NaN)).toBe('');
    expect(numberToDisplayableString(Infinity)).toBe('Infinity');
    expect(numberToDisplayableString(-Infinity)).toBe('-Infinity');

    // specifying decimal places to round to should have no effect
    expect(numberToDisplayableString(NaN, { places: 4 })).toBe('');
    expect(numberToDisplayableString(Infinity, { places: 3 })).toBe('Infinity');
    expect(numberToDisplayableString(-Infinity, { places: 2 })).toBe('-Infinity');
  });
});
