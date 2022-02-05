import { interpretColor } from './interpretColor';

it('hex strings', () => {
  let c = interpretColor('#af55e2');
  expect(c.toHex()).toBe('#af55e2');
  c = interpretColor('#EABC53'); // uppercase
  expect(c.toHex()).toBe('#eabc53');
  c = interpretColor('#a5c'); // 3 characters
  expect(c.toHex()).toBe('#aa55cc');
});

it('rgb string', () => {
  let c = interpretColor('rgb(132,155,78)');
  expect(c.toHex()).toBe('#849b4e');
});

it('not colors', () => {
  expect(interpretColor('asdf')).toBe(undefined);
  expect(interpretColor('1234')).toBe(undefined);
});
