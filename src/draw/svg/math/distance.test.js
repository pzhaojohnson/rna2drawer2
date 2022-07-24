import { distance2D } from './distance';

describe('distance2D function', () => {
  test('numeric values of different types', () => {
    let d = distance2D(
      5, // a number
      '8.5', // a number string
      '12px', // with pixel units
      '98%', // a percentage
    );
    expect(d).toBeCloseTo(10.27377243275322);
  });

  test('non-numeric values', () => {
    let d = distance2D(
      'asdf', // non-numeric
      5, 3, 9, // numbers
    );
    // non-numeric values seem to be interpreted as zero
    expect(d).toBeCloseTo(5);
  });
});
