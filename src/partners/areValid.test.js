import { areValid } from './areValid';

describe('valid partners', () => {
  it('empty', () => {
    expect(areValid([])).toBeTruthy();
  });

  it('entirely unpaired', () => {
    let partners = [null, undefined, undefined, null, null];
    expect(areValid(partners)).toBeTruthy();
  });

  it('with pairs', () => {
    let partners = [6, 5, null, undefined, 2, 1, null, undefined];
    expect(areValid(partners)).toBeTruthy();
  });

  it('with knots', () => {
    let partners = [null, 9, 8, undefined, 12, 11, null, 3, 2, null, 6, 5];
    expect(areValid(partners)).toBeTruthy();
  });

  it('entirely paired', () => {
    let partners = [6, 5, 4, 3, 2, 1];
    expect(areValid(partners)).toBeTruthy();
  });
});

describe('invalid partners', () => {
  it("partner isn't an integer", () => {
    let partners = [null, 4.5, null, null, null, null];
    expect(areValid(partners)).toBeFalsy();
  });

  it('partner is unpaired', () => {
    let partners = [null, undefined, null, 2, null];
    expect(areValid(partners)).toBeFalsy();
    partners = [null, 4, null, null, null, null];
    expect(areValid(partners)).toBeFalsy();
  });

  it('partner is in another pair', () => {
    let partners = [5, null, null, null, 9, undefined, null, undefined, 5];
    expect(areValid(partners)).toBeFalsy();
  });

  it('partner is out of bounds', () => {
    let partners = [null, 12, undefined, undefined]; // above bounds
    expect(areValid(partners)).toBeFalsy();
    partners = [undefined, undefined, undefined, -2, null]; // below bounds
    expect(areValid(partners)).toBeFalsy();
  });
});
