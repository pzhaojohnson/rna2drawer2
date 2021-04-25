import { initializePartners } from './Partners';

describe('initializePartners function', () => {
  it('creates empty partners by default', () => {
    expect(initializePartners()).toStrictEqual([]);
  });

  it('creates partners of specified length', () => {
    expect(initializePartners(2)).toStrictEqual(
      // initializes with nulls
      [null, null]
    );
    expect(initializePartners(5)).toStrictEqual(
      [null, null, null, null, null]
    );
  });
});
