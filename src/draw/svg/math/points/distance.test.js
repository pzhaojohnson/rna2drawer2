import { distance2D } from './distance';

describe('distance2D function', () => {
  test('different kinds of numeric values', () => {
    let d = distance2D(
      { x: 100.1, y: '3' }, // a number and a number string
      { x: '33.2px', y: '43%' }, // with pixels units and a percentage
    );
    expect(d).toBeCloseTo(66.94934577723669);
  });

  test('non-numeric values', () => {
    let d = distance2D(
      { x: 'Q', y: 10 }, // x is non-numeric
      { x: 5, y: 22 },
    );
    // non-numeric values seem to be interpreted as zero
    expect(d).toBeCloseTo(13);
  });
});
