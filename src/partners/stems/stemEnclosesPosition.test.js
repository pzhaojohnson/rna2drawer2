import { createStem } from 'Partners/stems/Stem';

import { stemEnclosesPosition } from './stemEnclosesPosition';

describe('stemEnclosesPosition function', () => {
  test('when no positions are enclosed by the stem', () => {
    let stem = createStem({ bottomPair: [9, 12], numPairs: 2 });
    expect(stemEnclosesPosition(stem, 3)).toBeFalsy(); // further before stem
    expect(stemEnclosesPosition(stem, 8)).toBeFalsy(); // immediately before stem
    expect(stemEnclosesPosition(stem, 9)).toBeFalsy(); // in upstream side
    expect(stemEnclosesPosition(stem, 10)).toBeFalsy(); // in upstream side
    expect(stemEnclosesPosition(stem, 11)).toBeFalsy(); // in downstream side
    expect(stemEnclosesPosition(stem, 12)).toBeFalsy(); // in downstream side
    expect(stemEnclosesPosition(stem, 13)).toBeFalsy(); // immediately after stem
    expect(stemEnclosesPosition(stem, 20)).toBeFalsy(); // further after stem
  });

  test('when there are positions enclosed by the stem', () => {
    let stem = createStem({ bottomPair: [13, 6], numPairs: 3 });
    expect(stemEnclosesPosition(stem, 2)).toBeFalsy(); // further before stem
    expect(stemEnclosesPosition(stem, 5)).toBeFalsy(); // immediately before stem
    expect(stemEnclosesPosition(stem, 6)).toBeFalsy(); // in upstream side
    expect(stemEnclosesPosition(stem, 7)).toBeFalsy(); // in upstream side
    expect(stemEnclosesPosition(stem, 8)).toBeFalsy(); // in upstream side
    expect(stemEnclosesPosition(stem, 9)).toBeTruthy(); // enclosed
    expect(stemEnclosesPosition(stem, 10)).toBeTruthy(); // enclosed
    expect(stemEnclosesPosition(stem, 11)).toBeFalsy(); // in downstream side
    expect(stemEnclosesPosition(stem, 12)).toBeFalsy(); // in downstream side
    expect(stemEnclosesPosition(stem, 13)).toBeFalsy(); // in downstream side
    expect(stemEnclosesPosition(stem, 14)).toBeFalsy(); // immediately after stem
    expect(stemEnclosesPosition(stem, 18)).toBeFalsy(); // further after stem
  });
});
