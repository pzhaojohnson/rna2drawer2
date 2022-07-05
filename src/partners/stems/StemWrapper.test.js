import { createStem } from 'Partners/Stem';

import { StemWrapper } from './StemWrapper';

describe('StemWrapper class', () => {
  test('stem property', () => {
    let st = createStem({ bottomPair: [20, 56], numPairs: 3 });
    let stem = new StemWrapper(st);
    expect(stem.stem).toBe(st);
  });

  test('bottomPair and topPair methods', () => {
    let stem = new StemWrapper(createStem({ bottomPair: [79, 3], numPairs: 8 }));

    let bottomPair = stem.bottomPair();
    expect(bottomPair.upstreamPartner).toBe(3);
    expect(bottomPair.downstreamPartner).toBe(79);

    let topPair = stem.topPair();
    expect(topPair.upstreamPartner).toBe(10);
    expect(topPair.downstreamPartner).toBe(72);
  });

  test('numPairs getter', () => {
    let stem = new StemWrapper(createStem({ bottomPair: [1, 100], numPairs: 16 }));
    expect(stem.numPairs).toBe(16);
  });
});
