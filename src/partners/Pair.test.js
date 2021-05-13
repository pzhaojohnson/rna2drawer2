import {
  partner5,
  partner3,
} from './Pair';

it('partner5 function', () => {
  // 5' partner is first
  expect(partner5([33, 78])).toBe(33);
  // 5' partner is second
  expect(partner5([89, 73])).toBe(73);
});

it('partner3 function', () => {
  // 3' partner is second
  expect(partner3([20, 41])).toBe(41);
  // 3' partner is first
  expect(partner3([66, 52])).toBe(66);
});
