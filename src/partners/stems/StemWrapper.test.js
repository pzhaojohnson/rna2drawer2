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

  test('equals method', () => {
    // bottom pair partners in different orders
    let stem = new StemWrapper(createStem({ bottomPair: [3, 72], numPairs: 2 }));
    let otherStem = createStem({ bottomPair: [72, 3], numPairs: 2 });
    expect(stem.equals(otherStem)).toBeTruthy();
    expect(stem.equals(new StemWrapper(otherStem))).toBeTruthy();

    // one bottom pair partner different
    stem = new StemWrapper(createStem({ bottomPair: [4, 200], numPairs: 7 }));
    otherStem = createStem({ bottomPair: [5, 200], numPairs: 7 });
    expect(stem.equals(otherStem)).toBeFalsy();
    expect(stem.equals(new StemWrapper(otherStem))).toBeFalsy();
  });

  test('containsPosition method', () => {
    let stem = new StemWrapper(createStem({ bottomPair: [4, 98], numPairs: 6 }));
    expect(stem.containsPosition(1)).toBeFalsy();
    expect(stem.containsPosition(5)).toBeTruthy();
    expect(stem.containsPosition(50)).toBeFalsy();
    expect(stem.containsPosition(94)).toBeTruthy();
    expect(stem.containsPosition(200)).toBeFalsy();
  });
});
