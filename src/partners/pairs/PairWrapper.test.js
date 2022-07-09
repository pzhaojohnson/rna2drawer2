import { PairWrapper } from './PairWrapper';

describe('PairWrapper class', () => {
  test('constructor and pair property', () => {
    let pr = [3, 20];

    let pair = new PairWrapper(pr); // from a pair tuple
    expect(pair.pair).toBe(pr);

    pair = new PairWrapper(new PairWrapper(pr)); // from another pair wrapper
    expect(pair.pair).toBe(pr);
  });

  test('deepCopy method', () => {
    let pair = new PairWrapper([511, 712]);
    let deepCopy = pair.deepCopy();
    expect(deepCopy).not.toBe(pair); // created a new pair wrapper
    expect(deepCopy.pair).not.toBe(pair.pair); // created a new wrapped pair
    expect(deepCopy.equals(pair)).toBeTruthy(); // is a copy
  });

  test('upstreamPartner and downstreamPartner getters', () => {
    let pair = new PairWrapper([5, 12]);
    expect(pair.upstreamPartner).toBe(5);
    expect(pair.downstreamPartner).toBe(12);

    pair = new PairWrapper([100, 22]); // switch order
    expect(pair.upstreamPartner).toBe(22);
    expect(pair.downstreamPartner).toBe(100);
  });

  test('equals method', () => {
    let pair = new PairWrapper([38, 69]);

    expect(pair.equals([69, 38])).toBeTruthy(); // different order
    expect(pair.equals(new PairWrapper([69, 38]))).toBeTruthy();

    expect(pair.equals([38, 68])).toBeFalsy(); // one partner different
    expect(pair.equals(new PairWrapper([38, 68]))).toBeFalsy();
  });
});
