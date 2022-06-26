import { interpretColorValue } from './interpretColorValue';

test('interpretColorValue function', () => {
  let c = interpretColorValue('rgb(204, 167, 58)');
  expect(c.toHex().toLowerCase()).toBe('#cca73a');
});
