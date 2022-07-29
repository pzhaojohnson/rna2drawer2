import { createRectanglePathString } from './createRectanglePathString';

describe('createRectanglePathString function', () => {
  test('with border radius of zero', () => {
    let spec = {
      width: 50,
      height: 85,
      borderRadius: 0,
      rotation: 0.35,
      center: { x: 88, y: 102 },
    };
    let d = createRectanglePathString(spec);
    expect(d).toBe('M 126.05747463804117 70.64910489037268 A 0 0 90 0 1 126.05747463804117 70.64910489037268 L 96.9111610043278 150.4957854823999 A 0 0 90 0 1 96.9111610043278 150.4957854823999 L 49.94252536195885 133.35089510962732 A 0 0 90 0 1 49.94252536195885 133.35089510962732 L 79.08883899567223 53.504214517600104 A 0 0 90 0 1 79.08883899567223 53.504214517600104 Z');
  });

  test('with positive border radius', () => {
    let spec = {
      width: 100,
      height: 42,
      borderRadius: 18,
      rotation: -0.5,
      center: { x: 30, y: 20 },
    };
    let d = createRectanglePathString(spec);
    expect(d).toBe('M 48.01470566980367 -13.770851035032322 A 18 18 90 0 1 72.44085147870604 -6.604024615881267 L 75.31740471033126 -1.338529244539031 A 18 18 90 0 1 68.15057829118021 23.087616564363334 L 11.98529433019636 53.77085103503234 A 18 18 90 0 1 -12.440851478706008 46.604024615881286 L -15.317404710331227 41.338529244539046 A 18 18 90 0 1 -8.150578291180175 16.912383435636677 Z');
  });

  test('with negative border radius', () => {
    let spec = {
      width: 20,
      height: 30,
      borderRadius: -8, // negative
      rotation: 4,
      center: { x: -40, y: -50 },
    };
    let d1 = createRectanglePathString(spec);
    spec.borderRadius = 0; // make zero
    let d2 = createRectanglePathString(spec);
    expect(d1).toBe(d2);
  });

  test('with border radius that is too big', () => {
    let spec = {
      width: 30,
      height: 25,
      borderRadius: 14, // greater than half the height
      rotation: 0.1,
      center: { x: 2, y: 5 },
    };
    let d1 = createRectanglePathString(spec);
    spec.borderRadius = 25 / 2; // make half the height
    let d2 = createRectanglePathString(spec);
    expect(d1).toBe(d2);
  });
});
