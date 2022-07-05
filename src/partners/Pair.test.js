import { upstreamPartner } from './Pair';
import { downstreamPartner } from './Pair';

it('upstreamPartner function', () => {
  // upstream partner is first
  expect(upstreamPartner([33, 78])).toBe(33);
  // upstream partner is second
  expect(upstreamPartner([89, 73])).toBe(73);
});

it('downstreamPartner function', () => {
  // downstream partner is second
  expect(downstreamPartner([20, 41])).toBe(41);
  // downstream partner is first
  expect(downstreamPartner([66, 52])).toBe(66);
});
