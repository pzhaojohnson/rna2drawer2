import type { Linker } from 'Partners/linkers/Linker';
import { upstreamBoundingPosition } from 'Partners/linkers/Linker';
import { downstreamBoundingPosition } from 'Partners/linkers/Linker';

export function linkerContainsPosition(linker: Linker, p: number): boolean {
  return (
    p > upstreamBoundingPosition(linker)
    && p < downstreamBoundingPosition(linker)
  );
}
