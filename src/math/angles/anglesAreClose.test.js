import { anglesAreClose } from './anglesAreClose';

describe('anglesAreClose function', () => {
  describe('normalizing angles that are far away from 0 and 2 * Math.PI', () => {
    test('when angle 1 is slightly clockwise to angle 2', () => {
      let a1 = (3 * Math.PI / 5) - 1e-7;
      let a2 = (-7 * Math.PI / 5);
      expect(anglesAreClose(a1, a2)).toBeTruthy();
      expect(anglesAreClose(a1, a2, { places: 7 })).toBeFalsy();
    });

    test('when angle 2 is slightly clockwise to angle 1', () => {
      let a1 = (12 * Math.PI / 10) + 1e-6;
      let a2 = (12 * Math.PI / 10) + (6 * Math.PI);
      expect(anglesAreClose(a1, a2)).toBeTruthy();
      expect(anglesAreClose(a1, a2, { places: 6 })).toBeFalsy();
    });
  });

  describe('normalizing angles that are close to 0 and 2 * Math.PI', () => {
    test('when angle 1 is slightly clockwise to angle 2', () => {
      let a1 = (12 * Math.PI) - 1e-10;
      let a2 = (-2 * Math.PI) + 1e-10;
      expect(anglesAreClose(a1, a2)).toBeTruthy();
      expect(anglesAreClose(a1, a2, { places: 10 })).toBeFalsy();
    });

    test('when angle 2 is slightly clockwise to angle 1', () => {
      let a1 = (-6 * Math.PI) + 1e-8;
      let a2 = (20 * Math.PI) - 1e-8;
      expect(anglesAreClose(a1, a2)).toBeTruthy();
      expect(anglesAreClose(a1, a2, { places: 8 })).toBeFalsy();
    });
  });
});
