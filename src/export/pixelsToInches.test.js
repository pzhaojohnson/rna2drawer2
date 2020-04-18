import { pixelsToInches } from './pixelsToInches';

it('pixelsToInches function', () => {
  expect(pixelsToInches(96)).toBeCloseTo(1, 3);
});
