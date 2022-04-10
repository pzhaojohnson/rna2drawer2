import { displayablePercentageString } from './displayablePercentageString';

describe('displayablePercentageString function', () => {
  test('various proportions and decimal places to round to', () => {
    // no rounding necessary
    expect(displayablePercentageString(0, { places: 0 })).toBe('0%');
    expect(displayablePercentageString(1, { places: 0 })).toBe('100%');
    expect(displayablePercentageString(-1, { places: 0 })).toBe('-100%');
    expect(displayablePercentageString(0.5, { places: 0 })).toBe('50%');
    expect(displayablePercentageString(0.25, { places: 0 })).toBe('25%');
    expect(displayablePercentageString(-0.17, { places: 0 })).toBe('-17%');
    expect(displayablePercentageString(3.22, { places: 0 })).toBe('322%');
    expect(displayablePercentageString(0.01848, { places: 3 })).toBe('1.848%');

    // excess places
    expect(displayablePercentageString(0.123, { places: 5 })).toBe('12.3%');
    // rounds up
    expect(displayablePercentageString(0.23766, { places: 1 })).toBe('23.8%');
    // rounds down
    expect(displayablePercentageString(0.582433, { places: 2 })).toBe('58.24%');
    // rounds to integers
    expect(displayablePercentageString(0.39248, { places: 0 })).toBe('39%');
    // rounds negatives
    expect(displayablePercentageString(-0.28743, { places: 1 })).toBe('-28.7%');
  });

  test('undefined and null', () => {
    // specifying decimal places to round to should have no effect
    expect(displayablePercentageString(undefined, { places: 2 })).toBe('');
    expect(displayablePercentageString(null, { places: 3 })).toBe('');
  });

  test('nonfinite numbers', () => {
    // specifying decimal places to round to should have no effect
    expect(displayablePercentageString(NaN, { places: 5 })).toBe('');
    expect(displayablePercentageString(Infinity, { places: 1 })).toBe('Infinity%');
    expect(displayablePercentageString(-Infinity, { places: 2 })).toBe('-Infinity%');
  });
});
