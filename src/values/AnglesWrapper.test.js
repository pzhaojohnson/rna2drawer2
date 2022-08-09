import { AnglesWrapper } from './AnglesWrapper';

describe('AnglesWrapper class', () => {
  test('angles property', () => {
    let anglesArray = [0, Math.PI, Math.PI / 2, -3 * Math.PI / 4, null];
    let angles = new AnglesWrapper(anglesArray);
    expect(angles.angles).toBe(anglesArray);
  });
});
