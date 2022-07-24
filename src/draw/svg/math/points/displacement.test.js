import { displacement2D } from './displacement';

describe('displacement2D function', () => {
  test('different kinds of numeric values', () => {
    let d = displacement2D(
      { x: 12.7, y: '3.1' }, // a number and a number string
      { x: '55.2px', y: '20%' }, // with pixels units and a percentage
    );
    expect(d.x).toBeCloseTo(42.5);
    expect(d.y).toBeCloseTo(-2.9);
  });

  test('non-numeric values', () => {
    let d = displacement2D(
      { x: 'qwer', y: 8 }, // x is non-numeric
      { x: -5, y: 10 },
    );
    // non-numeric values seem to be interpreted as zero
    expect(d.x).toBeCloseTo(-5);
    expect(d.y).toBeCloseTo(2);
  });
});
