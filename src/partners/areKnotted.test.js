import { areKnotted } from './areKnotted';

describe('areKnotted function', () => {
  describe('are knotted', () => {
    it('pair 1 is upstream', () => {
      expect(
        areKnotted([12, 22], [16, 30])
      ).toBeTruthy();
      expect(
        areKnotted([22, 12], [16, 30]) // switch positions in pair 1
      ).toBeTruthy();
      expect(
        areKnotted([12, 22], [30, 16]) // switch positions in pair 2
      ).toBeTruthy();
    });

    it('pair 1 is downstream', () => {
      expect(
        areKnotted([110, 208], [55, 151])
      ).toBeTruthy();
      expect(
        areKnotted([208, 110], [55, 151]) // switch positions in pair 1
      ).toBeTruthy();
      expect(
        areKnotted([110, 208], [151, 55]) // switch positions in pair 2
      ).toBeTruthy();
    });
  });

  describe('are not knotted', () => {
    it('pair 1 is upstream', () => {
      expect(
        areKnotted([5, 15], [18, 22])
      ).toBeFalsy();
      expect(
        areKnotted([15, 5], [18, 22]) // switch positions in pair 1
      ).toBeFalsy();
      expect(
        areKnotted([5, 15], [22, 18]) // switch positions in pair 2
      ).toBeFalsy();
    });

    it('pair 1 is downstream', () => {
      expect(
        areKnotted([200, 300], [50, 100])
      ).toBeFalsy();
      expect(
        areKnotted([300, 200], [50, 100]) // switch positions in pair 1
      ).toBeFalsy();
      expect(
        areKnotted([200, 300], [100, 50]) // switch positions in pair 2
      ).toBeFalsy();
    });

    it('pair 1 encompasses pair 2', () => {
      expect(
        areKnotted([2, 32], [8, 24])
      ).toBeFalsy();
      expect(
        areKnotted([32, 2], [8, 24]) // switch positions in pair 1
      ).toBeFalsy();
      expect(
        areKnotted([2, 32], [24, 8]) // switch positions in pair 2
      ).toBeFalsy();
    });

    it('pair 2 encompasses pair 1', () => {
      expect(
        areKnotted([14, 19], [9, 28])
      ).toBeFalsy();
      expect(
        areKnotted([19, 14], [9, 28]) // switch positions in pair 1
      ).toBeFalsy();
      expect(
        areKnotted([14, 19], [28, 9]) // switch positions in pair 2
      ).toBeFalsy();
    });
  });
});
