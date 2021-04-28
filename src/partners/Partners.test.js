import { unstructuredPartners } from './Partners';

describe('unstructuredPartners function', () => {
  it('creates empty partners by default', () => {
    expect(unstructuredPartners()).toStrictEqual([]);
  });

  it('creates partners of specified length', () => {
    expect(unstructuredPartners(2)).toStrictEqual(
      [null, null]
    );
    expect(unstructuredPartners(5)).toStrictEqual(
      [null, null, null, null, null]
    );
  });
});
