import type { Linker } from 'Partners/linkers/Linker';
import { upstreamBoundingPosition } from 'Partners/linkers/Linker';
import { downstreamBoundingPosition } from 'Partners/linkers/Linker';

export function linkersAreEqual(linker1: Linker, linker2: Linker): boolean {
  return (
    upstreamBoundingPosition(linker1) == upstreamBoundingPosition(linker2)
    && downstreamBoundingPosition(linker1) == downstreamBoundingPosition(linker2)
  );
}
