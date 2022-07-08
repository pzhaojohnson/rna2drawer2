import { sortNumbers } from 'Array/sortNumbers';

import { upstreamSideOfStem } from './upstreamSideOfStem';

describe('upstreamSideOfStem function', () => {
  test('a stem with just one pair', () => {
    let stem = { position5: 12, position3: 33, size: 1 };
    let side = upstreamSideOfStem(stem);
    expect(side).toStrictEqual([12]);
  });

  test('a stem with more than one pair', () => {
    let stem = { position5: 123, position3: 156, size: 5 };
    let side = upstreamSideOfStem(stem);
    sortNumbers(side);
    expect(side).toStrictEqual([123, 124, 125, 126, 127]);
  });
});
