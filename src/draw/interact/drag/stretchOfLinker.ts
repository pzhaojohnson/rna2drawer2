import { StrictLayoutSpecification } from './StrictLayoutSpecification';
import { Linker } from 'Partners/linkers/Linker';
import { upstreamBoundingPosition } from 'Partners/linkers/Linker';
import { downstreamBoundingPosition } from 'Partners/linkers/Linker';
import { atPosition } from 'Array/at';
import { initializeAtPosition } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

function positionsWithStretch3(linker: Linker): number[] {
  let ps: number[] = [];
  let ubp = upstreamBoundingPosition(linker);
  if (ubp > 0) {
    ps.push(ubp);
  }
  for (let p = ubp + 1; p < downstreamBoundingPosition(linker); p++) {
    ps.push(p);
  }
  return ps;
}

// returns how much a linker is stretched
export function stretchOfLinker(spec: StrictLayoutSpecification, linker: Linker): number {
  let stretch = 0;
  positionsWithStretch3(linker).forEach(p => {
    let props = atPosition(spec.perBasePropsArray, p);
    if (props) {
      stretch += props.stretch3;
    }
  });
  return stretch;
}

// sets the stretch for the linker
// (note that it is not possible to set the stretch of a 5' most leading linker of size zero)
export function setStretchOfLinker(spec: StrictLayoutSpecification, linker: Linker, stretch: number) {
  let ps = positionsWithStretch3(linker);
  if (ps.length == 0) {
    console.error('Unable to set the stretch of the given linker.');
    return;
  }

  let s = stretch / ps.length;
  ps.forEach(p => {
    let props = atPosition(spec.perBasePropsArray, p) ?? initializeAtPosition(spec.perBasePropsArray, p);
    props.stretch3 = s;
  });
}
