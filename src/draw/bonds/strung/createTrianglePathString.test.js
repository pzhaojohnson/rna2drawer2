import { createTrianglePathString } from './createTrianglePathString';

describe('createTrianglePathString function', () => {
  test('with a tails height of zero', () => {
    let spec = {
      width: 15,
      height: 28,
      tailsHeight: 0,
      rotation: 3 * Math.PI / 2,
      center: { x: 10, y: 8 },
    };
    let d = createTrianglePathString(spec);
    expect(d).toBe('M -4 8.000000000000002 L 24 0.49999999999999656 L 24 7.9999999999999964 L 24 15.499999999999996 Z');
  });

  test('with a positive tails height', () => {
    let spec = {
      width: 24,
      height: 28,
      tailsHeight: 7.5,
      rotation: 0.4,
      center: { x: 101.2, y: 26 },
    };
    let d = createTrianglePathString(spec);
    expect(d).toBe('M 106.65185679232111 13.105146083959609 L 106.80087513571351 43.567874023744196 L 98.66878077499378 31.986896461018752 L 84.69541127964428 34.22183380833659 Z');
  });

  test('with a negative tails height', () => {
    let spec = {
      width: 48,
      height: 30,
      tailsHeight: -20,
      rotation: 2.8,
      center: { x: -20, y: -11 },
    };
    let d = createTrianglePathString(spec);
    expect(d).toBe('M -14.975177747661423 3.1333351100298703 L -47.638158428386376 -17.09361950628815 L -31.72458525545668 -43.97778192340303 L -2.4114860762907817 -33.173050713771595 Z');
  });

  test('with a tails height that is too big', () => {
    let spec = {
      width: 18,
      height: 32,
      tailsHeight: 35, // greater than the total height
      rotation: -0.9,
      center: { x: -25, y: 15 },
    };
    let d1 = createTrianglePathString(spec);
    spec.tailsHeight = 32; // make same as total height
    let d2 = createTrianglePathString(spec);
    expect(d1).toBe(d2);
  });
});
