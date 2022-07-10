import type { Linker } from 'Partners/linkers/Linker';
import { deepCopyLinker } from 'Partners/linkers/Linker';

import { upstreamBoundingPosition } from 'Partners/linkers/Linker';
import { downstreamBoundingPosition } from 'Partners/linkers/Linker';
import { positionsInLinker } from 'Partners/linkers/Linker';
import { numPositionsInLinker } from 'Partners/linkers/Linker';

import { linkerContainsPosition } from 'Partners/linkers/linkerContainsPosition';
import { linkersAreEqual } from 'Partners/linkers/linkersAreEqual';

export class LinkerWrapper {
  /**
   * The wrapped linker.
   */
  readonly linker: Linker;

  constructor(linker: Linker | LinkerWrapper) {
    this.linker = linker instanceof LinkerWrapper ? linker.linker : linker;
  }

  deepCopy(): LinkerWrapper {
    return new LinkerWrapper(deepCopyLinker(this.linker));
  }

  get upstreamBoundingPosition() {
    return upstreamBoundingPosition(this.linker);
  }

  get downstreamBoundingPosition() {
    return downstreamBoundingPosition(this.linker);
  }

  /**
   * Returns the positions in the linker.
   */
  positions() {
    return positionsInLinker(this.linker);
  }

  /**
   * Returns the number of positions in the linker.
   */
  get numPositions() {
    return numPositionsInLinker(this.linker);
  }

  containsPosition(p: number): boolean {
    return linkerContainsPosition(this.linker, p);
  }

  equals(other: Linker | LinkerWrapper): boolean {
    let otherLinker = other instanceof LinkerWrapper ? other.linker : other;
    return linkersAreEqual(this.linker, otherLinker);
  }
}

export {
  LinkerWrapper as Linker,
};
