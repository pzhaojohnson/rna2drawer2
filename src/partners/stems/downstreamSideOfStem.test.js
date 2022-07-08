import { sortNumbers } from 'Array/sortNumbers';

import { downstreamSideOfStem } from './downstreamSideOfStem';

describe('downstreamSideOfStem function', () => {
  test('a stem with just one pair', () => {
    let stem = { position5: 12, position3: 33, size: 1 };
    let side = downstreamSideOfStem(stem);
    expect(side).toStrictEqual([33]);
  });

  test('a stem with more than one pair', () => {
    let stem = { position5: 123, position3: 158, size: 5 };
    let side = downstreamSideOfStem(stem);
    sortNumbers(side);
    expect(side).toStrictEqual([154, 155, 156, 157, 158]);
  });
});
