/**
 * A (possibly empty) set of consecutive unpaired positions
 * connecting two stems together or connecting a stem
 * with the very beginning or end of the structure.
 *
 * A linker will contain zero positions if its two bounding
 * positions are only one apart from each other.
 */
export type Linker = {
  /**
   * The position immediately 5' of the linker
   * (may be zero if the linker is at the very beginning
   * of the structure).
   */
  boundingPosition5: number;

  /**
   * The position immediately 3' of the linker
   * (may be one more than the structure length
   * if the linker is at the very end of the structure).
   */
  boundingPosition3: number;
};

export type LinkerSpecification = (
  { upstreamBoundingPosition: number, downstreamBoundingPosition: number }
);

/**
 * Allows for linker objects to be specified in different ways
 * without knowledge of the underlying object structure.
 */
export function createLinker(spec: LinkerSpecification): Linker {
  return {
    boundingPosition5: spec.upstreamBoundingPosition,
    boundingPosition3: spec.downstreamBoundingPosition,
  };
}

export function deepCopyLinker(linker: Linker): Linker {
  return { ...linker };
}

export function upstreamBoundingPosition(linker: Linker): number {
  return linker.boundingPosition5;
}

export function downstreamBoundingPosition(linker: Linker): number {
  return linker.boundingPosition3;
}

/**
 * Returns an array of the positions in the linker.
 */
export function positionsInLinker(linker: Linker): number[] {
  let ubp = upstreamBoundingPosition(linker);
  let dbp = downstreamBoundingPosition(linker);

  let ps: number[] = [];
  for (let p = ubp + 1; p < dbp; p++) {
    ps.push(p);
  }
  return ps;
}

/**
 * Returns the number of positions in the linker
 * (i.e., the number of positions between the upstream
 * and downstream bounding positions).
 */
export function numPositionsInLinker(linker: Linker): number {
  return downstreamBoundingPosition(linker) - upstreamBoundingPosition(linker) - 1;
}
