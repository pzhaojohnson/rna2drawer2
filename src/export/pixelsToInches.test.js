import { pixelsToInches } from './pixelsToInches';

it('pixelsToInches function', () => {
  expect(pixelsToInches(96)).toBeCloseTo(1);
  expect(pixelsToInches(0)).toBe(0);
  expect(pixelsToInches(288)).toBeCloseTo(3);
});
