import { isTree } from 'Partners/isTree';

import { treeify } from './treeify';

test('treeify function', () => {
  let partners = [6, 5, 8, 7, 2, 1, 4, 3];
  expect(isTree(partners)).toBeFalsy();
  partners = treeify(partners);
  expect(isTree(partners)).toBeTruthy();
});
