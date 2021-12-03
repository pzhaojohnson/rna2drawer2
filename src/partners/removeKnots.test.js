import { removeKnots } from './removeKnots';
import { unstructuredPartners } from 'Partners/unstructuredPartners';
import { pair } from './edit';
import { hasKnots } from './hasKnots';

describe('removeKnots function', () => {
  it('empty partners', () => {
    expect(removeKnots([])).toStrictEqual([]);
  });

  it('unstructured partners', () => {
    let partners = [undefined, null, null];
    expect(removeKnots(partners)).toStrictEqual(
      [null, null, null]
    );
  });

  it('no knots', () => {
    let partners = [6, 5, null, null, 2, 1];
    expect(removeKnots(partners)).toStrictEqual(partners);
  });

  it('knot between hairpin loop and upstream positions', () => {
    let partners = [9, 8, null, 13, 12, 11, null, 2, 1, null, 6, 5, 4];
    // keeps the knot and removes the hairpin with the current implementation
    expect(removeKnots(partners)).toStrictEqual(
      [9, 8, null, null, null, null, null, 2, 1, null, null, null, null]
    );
  });

  it('knot between hairpin loop and downstream positions', () => {
    let partners = [10, 9, 8, null, 13, 12, null, 3, 2, 1, null, 6, 5];
    expect(removeKnots(partners)).toStrictEqual(
      [10, 9, 8, null, null, null, null, 3, 2, 1, null, null, null]
    );
  });

  it('smoke test', () => {
    for (let i = 0; i < 1000; i++) {
      let partners = unstructuredPartners(200);
      for (let j = 0; j < 50; j++) {
        let p = Math.floor(partners.length * Math.random()) + 1;
        let q = Math.floor(partners.length * Math.random()) + 1;
        if (p != q) {
          pair(partners, p, q);
        }
        let noKnots = removeKnots(partners);
        expect(hasKnots(noKnots)).toBeFalsy();
      }
    }
  });
});
