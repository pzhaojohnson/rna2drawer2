import { isTree } from './isTree';

describe('isTree function', () => {
  test('a structure that has a tree shape', () => {
    let partners = [null, null, 8, 7, null, null, 4, 3, undefined];
    expect(isTree(partners)).toBeTruthy();
  });

  test('a structure that does not have a tree shape', () => {
    let partners = [8, 7, null, 11, 10, null, 2, 1, null, 5, 4];
    expect(isTree(partners)).toBeFalsy();
  });
});
