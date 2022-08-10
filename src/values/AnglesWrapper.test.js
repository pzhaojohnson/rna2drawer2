import { AnglesWrapper } from './AnglesWrapper';

describe('AnglesWrapper class', () => {
  test('angles property', () => {
    let anglesArray = [0, Math.PI, Math.PI / 2, -3 * Math.PI / 4, null];
    let angles = new AnglesWrapper(anglesArray);
    expect(angles.angles).toBe(anglesArray);
  });

  describe('normalize method', () => {
    test('when the angle floor is specified', () => {
      let angles = new AnglesWrapper(
        [-Math.PI / 3, 26 * Math.PI / 3, 15 * Math.PI / 4]
      );
      angles = angles.normalize({ angleFloor: 3 * Math.PI });
      expect(angles.angles.length).toBe(3);
      // increased
      expect(angles.angles[0]).toBeCloseTo(11 * Math.PI / 3);
      // decreased
      expect(angles.angles[1]).toBeCloseTo(14 * Math.PI / 3);
      // stayed the same
      expect(angles.angles[2]).toBeCloseTo(15 * Math.PI / 4);
    });

    test('when the angle floor is left unspecified', () => {
      let angles = new AnglesWrapper(
        [Math.PI / 4, -11 * Math.PI / 2, 19 * Math.PI / 3]
      );
      // should use an angle floor of zero
      angles = angles.normalize();
      expect(angles.angles.length).toBe(3);
      // stayed the same
      expect(angles.angles[0]).toBeCloseTo(Math.PI / 4);
      // increased
      expect(angles.angles[1]).toBeCloseTo(Math.PI / 2);
      // decreased
      expect(angles.angles[2]).toBeCloseTo(Math.PI / 3);
    });

    test('nullish values in angles array', () => {
      let angles = new AnglesWrapper(
        [15 * Math.PI / 2, null, undefined]
      );
      angles = angles.normalize();
      expect(angles.angles.length).toBe(3);
      // normalized non-nullish value
      expect(angles.angles[0]).toBeCloseTo(3 * Math.PI / 2);
      // maintained nullish values
      expect(angles.angles[1]).toBe(null);
      expect(angles.angles[2]).toBeUndefined();
    });
  });
});
