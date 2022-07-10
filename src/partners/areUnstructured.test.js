import { areUnstructured } from './areUnstructured';

describe('areUnstructured function', () => {
  test('empty partners', () => {
    let partners = [];
    expect(areUnstructured(partners)).toBeTruthy();
  });

  test('unstructured partners of length greater than zero', () => {
    // test null and undefined values
    let partners = [undefined, null, undefined, null];
    expect(areUnstructured(partners)).toBeTruthy();
  });

  test('a hairpin', () => {
    let partners = [
      null, undefined,
      8, 7, null, undefined, 4, 3,
      null, undefined,
    ];
    expect(areUnstructured(partners)).toBeFalsy();
  });

  test('multiple stems', () => {
    let partners = [
      6, 5, null, null, 2, 1,
      undefined, undefined,
      14, 13, undefined, undefined, 10, 9,
    ];
    expect(areUnstructured(partners)).toBeFalsy();
  });
});
