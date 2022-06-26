import { average } from './average';

test('average function', () => {
  expect(average([3, 3, 8.5, 6, 82])).toBeCloseTo(20.5);
});
