import { downstreamSideOfStem } from './downstreamSideOfStem';
import { sortNumbers } from 'Array/sortNumbers';

describe('downstreamSideOfStem function', () => {
  test('a stem of size one', () => {
    let stem = { position5: 12, position3: 33, size: 1 };
    let side = downstreamSideOfStem(stem);
    expect(side).toStrictEqual([33]);
  });

  test('a stem of size greater than one', () => {
    let stem = { position5: 123, position3: 158, size: 5 };
    let side = downstreamSideOfStem(stem);
    sortNumbers(side);
    expect(side).toStrictEqual([154, 155, 156, 157, 158]);
  });
});
