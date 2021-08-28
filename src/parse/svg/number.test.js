import { parseNumber } from './number';

test('parseNumber function', () => {
  
  // are numbers
  [
    { v: 25, valueOf: 25 },
    { v: '55.1', valueOf: 55.1 },
    { v: '24px', valueOf: 24 },
    { v: '67.2%', valueOf: 0.672 },
    { v: '0.23em', valueOf: 0.23 },
  ].forEach(({ v, valueOf }) => {
    let n = parseNumber(v);
    expect(n.valueOf()).toBe(valueOf);
  });

  // are not numbers
  [
    'asdf',
    undefined,
    null,
    {},
    true,
    'f5a',
  ].forEach(v => {
    let n = parseNumber(v);
    expect(n.valueOf()).toBe(0); // is the built-in behavior
  });
});
