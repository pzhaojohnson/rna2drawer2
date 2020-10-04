import { positionsOfStem } from './positionsOfStem';

it('stem of size one', () => {
  expect(positionsOfStem({
    position5: 12,
    position3: 24,
    size: 1,
  })).toStrictEqual([12, 24]);
});

it('stem of size greater than one', () => {
  expect(positionsOfStem({
    position5: 112,
    position3: 131,
    size: 4,
  })).toStrictEqual([112, 113, 114, 115, 128, 129, 130, 131]);
});
