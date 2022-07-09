import { UnpairedRegion } from 'Partners/UnpairedRegion';

export type Linker = UnpairedRegion;

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
