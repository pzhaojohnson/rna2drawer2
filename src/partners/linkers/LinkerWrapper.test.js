import { createLinker } from 'Partners/linkers/Linker';

import { LinkerWrapper } from './LinkerWrapper';

describe('LinkerWrapper class', () => {
  test('constructor and linker property', () => {
    let l = createLinker({ upstreamBoundingPosition: 27, downstreamBoundingPosition: 1012 });

    let linker = new LinkerWrapper(l); // from a linker object
    expect(linker.linker).toBe(l);

    linker = new LinkerWrapper(new LinkerWrapper(l)); // from a linker wrapper
    expect(linker.linker).toBe(l);
  });

  test('deepCopy method', () => {
    let linker = new LinkerWrapper(createLinker({ upstreamBoundingPosition: 3, downstreamBoundingPosition: 88 }));
    let deepCopy = linker.deepCopy();
    expect(deepCopy).not.toBe(linker); // created a new linker wrapper
    expect(deepCopy.linker).not.toBe(linker.linker); // created a new wrapped linker
    expect(deepCopy.equals(linker)).toBeTruthy(); // is a copy
  });

  test('upstreamBoundingPosition and downstreamBoundingPosition getters', () => {
    let linker = new LinkerWrapper(createLinker({ upstreamBoundingPosition: 158, downstreamBoundingPosition: 172 }));
    expect(linker.upstreamBoundingPosition).toBe(158);
    expect(linker.downstreamBoundingPosition).toBe(172);
  });

  test('positions method and numPositions getter', () => {
    let linker = new LinkerWrapper(createLinker({ upstreamBoundingPosition: 35, downstreamBoundingPosition: 41 }));
    expect(linker.positions()).toStrictEqual([36, 37, 38, 39, 40]);
    expect(linker.numPositions).toBe(5);
  });

  test('containsPosition method', () => {
    let linker = new LinkerWrapper(createLinker({ upstreamBoundingPosition: 6, downstreamBoundingPosition: 17 }));
    expect(linker.containsPosition(9)).toBeTruthy();
    expect(linker.containsPosition(20)).toBeFalsy();
  });

  test('equals method', () => {
    let linkerSpec = { upstreamBoundingPosition: 55, downstreamBoundingPosition: 62 };
    let linker = new LinkerWrapper(createLinker(linkerSpec));

    // are equal
    expect(linker.equals(createLinker(linkerSpec))).toBeTruthy();
    expect(linker.equals(new LinkerWrapper(createLinker(linkerSpec)))).toBeTruthy();

    // one bounding position different
    linkerSpec = { upstreamBoundingPosition: 56, downstreamBoundingPosition: 62 };
    expect(linker.equals(createLinker(linkerSpec))).toBeFalsy();
    expect(linker.equals(new LinkerWrapper(createLinker(linkerSpec)))).toBeFalsy();
  });
});
