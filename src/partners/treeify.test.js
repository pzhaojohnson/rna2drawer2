import { unstructuredPartners } from 'Partners/unstructuredPartners';
import { pair } from 'Partners/edit';
import { isTree } from 'Partners/isTree';

import { treeify } from './treeify';

describe('treeify function', () => {
  test('empty partners', () => {
    expect(treeify([])).toStrictEqual([]);
  });

  test('unstructured partners', () => {
    let partners = [undefined, null, null];
    expect(treeify(partners)).toStrictEqual(
      [null, null, null]
    );
  });

  test('a hairpin', () => {
    let partners = [6, 5, null, null, 2, 1];
    expect(treeify(partners)).toStrictEqual(
      [6, 5, null, null, 2, 1]
    );
  });

  test('a pseudoknot involving a hairpin loop', () => {
    let partners = [9, 8, null, 13, 12, 11, null, 2, 1, null, 6, 5, 4];
    // maintains the stem that was earlier in the structure
    expect(treeify(partners)).toStrictEqual(
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
        let noKnots = treeify(partners);
        expect(isTree(noKnots)).toBeTruthy();
      }
    }
  });
});
