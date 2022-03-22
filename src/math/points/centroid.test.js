import { centroid2D } from './centroid';

describe('centroid2D function', () => {
  test('an empty array of points', () => {
    let points = [];
    expect(centroid2D(points)).toStrictEqual(
      { x: NaN, y: NaN }
    );
  });

  test('an array with one point', () => {
    let points = [
      { x: 55.4, y: -20.7 },
    ];
    expect(centroid2D(points)).toStrictEqual(
      { x: 55.4, y: -20.7 },
    );
  });

  test('an array with multiple points', () => {
    let points = [
      { x: 8, y: 3.3 },
      { x: -1.2, y: 50 },
      { x: 5.2, y: 0.7 },
    ];
    expect(centroid2D(points)).toStrictEqual(
      { x: 4, y: 18 },
    );
  });
});
