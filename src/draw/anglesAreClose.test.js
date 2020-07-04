import anglesAreClose from './anglesAreClose';

describe('normalize angles are far away from 0 and 2 * Math.PI', () => {
  it('angle 1 is slightly clockwise to angle 2', () => {
    let a1 = (3 * Math.PI / 5) - 1e-7;
    let a2 = (-7 * Math.PI / 5);
    expect(anglesAreClose(a1, a2)).toBeTruthy();
    expect(anglesAreClose(a1, a2, 7)).toBeFalsy();
  });

  it('angle 2 is slightly clockwise to angle 1', () => {
    let a1 = (12 * Math.PI / 10) + 1e-6;
    let a2 = (12 * Math.PI / 10) + (6 * Math.PI);
    expect(anglesAreClose(a1, a2)).toBeTruthy();
    expect(anglesAreClose(a1, a2, 6)).toBeFalsy();
  });
});

describe('normalize angles are close to 0 and 2 * Math.PI', () => {
  it('angle 1 is slightly clockwise to angle 2', () => {
    let a1 = (12 * Math.PI) - 1e-10;
    let a2 = (-2 * Math.PI) + 1e-10;
    expect(anglesAreClose(a1, a2)).toBeTruthy();
    expect(anglesAreClose(a1, a2, 10)).toBeFalsy();
  });

  it('angle 2 is slightly clockwise to angle 1', () => {
    let a1 = (-6 * Math.PI) + 1e-8;
    let a2 = (20 * Math.PI) - 1e-8;
    expect(anglesAreClose(a1, a2)).toBeTruthy();
    expect(anglesAreClose(a1, a2, 8)).toBeFalsy();
  });
});
