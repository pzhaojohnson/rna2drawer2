import { UnpairedRegion } from 'Partners/UnpairedRegion';

export type Linker = UnpairedRegion;

export type LinkerSpecification = (
  { upstreamBoundingPosition: number, downstreamBoundingPosition: number }
);

// allows for linker objects to be specified in different ways
// without knowledge of the underlying object structure
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
