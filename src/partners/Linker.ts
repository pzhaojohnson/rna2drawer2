import { UnpairedRegion } from 'Partners/UnpairedRegion';

export type Linker = UnpairedRegion;

export function upstreamBoundingPosition(linker: Linker): number {
  return linker.boundingPosition5;
}

export function downstreamBoundingPosition(linker: Linker): number {
  return linker.boundingPosition3;
}
