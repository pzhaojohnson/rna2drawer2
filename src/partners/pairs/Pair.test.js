import { deepCopyPair } from './Pair';
import { upstreamPartner } from './Pair';
import { downstreamPartner } from './Pair';

test('deepCopyPair function', () => {
  let pair = [37, 909];
  let deepCopy = deepCopyPair(pair);
  expect(deepCopy).not.toBe(pair); // is a new object
  expect(deepCopy).toStrictEqual(pair); // is a copy

  pair = [55, 2]; // upstream and downstream partners reversed
  deepCopy = deepCopyPair(pair);
  expect(deepCopy).not.toBe(pair); // is a new object
  expect(deepCopy).toStrictEqual(pair); // is a copy
});

test('upstreamPartner function', () => {
  // upstream partner is first
  expect(upstreamPartner([33, 78])).toBe(33);
  // upstream partner is second
  expect(upstreamPartner([89, 73])).toBe(73);
});

test('downstreamPartner function', () => {
  // downstream partner is second
  expect(downstreamPartner([20, 41])).toBe(41);
  // downstream partner is first
  expect(downstreamPartner([66, 52])).toBe(66);
});
