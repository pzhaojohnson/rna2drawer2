import { parseColor } from './parseColor';

it('hex strings', () => {
  let c = parseColor('#af55e2');
  expect(c.toHex()).toBe('#af55e2');
  c = parseColor('#EABC53'); // uppercase
  expect(c.toHex()).toBe('#eabc53');
  c = parseColor('#a5c'); // 3 characters
  expect(c.toHex()).toBe('#aa55cc');
});

it('rgb string', () => {
  let c = parseColor('rgb(132,155,78)');
  expect(c.toHex()).toBe('#849b4e');
});

it('not colors', () => {
  expect(parseColor('asdf')).toBe(undefined);
  expect(parseColor('1234')).toBe(undefined);
});
