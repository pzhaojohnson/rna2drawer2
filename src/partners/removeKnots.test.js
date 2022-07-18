import { unstructuredPartners } from 'Partners/unstructuredPartners';
import { pair } from 'Partners/edit';
import { hasKnots } from 'Partners/hasKnots';

import { removeKnots } from './removeKnots';

describe('removeKnots function', () => {
  test('empty partners', () => {
    expect(removeKnots([])).toStrictEqual([]);
  });

  test('unstructured partners', () => {
    let partners = [undefined, null, null];
    expect(removeKnots(partners)).toStrictEqual(
      [null, null, null]
    );
  });

  test('a hairpin', () => {
    let partners = [6, 5, null, null, 2, 1];
    expect(removeKnots(partners)).toStrictEqual(partners);
  });

  test('a knot involving a hairpin loop', () => {
    let partners = [9, 8, null, 13, 12, 11, null, 2, 1, null, 6, 5, 4];
    // maintains the stem that was earlier in the structure
    expect(removeKnots(partners)).toStrictEqual(
      [9, 8, null, null, null, null, null, 2, 1, null, null, null, null]
    );
  });

  test('smoke test', () => {
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
