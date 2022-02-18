import { Linker } from 'Partners/Linker';
import { upstreamBoundingPosition } from 'Partners/Linker';
import { downstreamBoundingPosition } from 'Partners/Linker';

export function linkersAreEqual(linker1: Linker, linker2: Linker): boolean {
  return (
    upstreamBoundingPosition(linker1) == upstreamBoundingPosition(linker2)
    && downstreamBoundingPosition(linker1) == downstreamBoundingPosition(linker2)
  );
}
