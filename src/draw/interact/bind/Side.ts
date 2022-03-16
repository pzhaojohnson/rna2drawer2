import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

// consecutive bases in a sequence that could form the side of a stem
// (bases should be in ascending order by sequence position)
export type Side = Base[];

export function sidesAreEqual(side1: Side, side2: Side): boolean {
  if (side1.length != side2.length) {
    return false;
  }
  for (let i = 0; i < side1.length; i++) {
    if (side1[i] != side2[i]) {
      return false;
    }
  }
  return true;
}

// it is also possible to do something like:
//   return side1.some(base => side2.includes(base))
// but the below implementation is more performant
export function sidesOverlap(side1: Side, side2: Side): boolean {
  if (side1.length == 0 || side2.length == 0) {
    return false;
  }
  return !(
    !side1.includes(side2[0])
    && !side1.includes(side2[side2.length - 1])
    && !side2.includes(side1[0])
    && !side2.includes(side1[side1.length - 1])
  );
}

export type SideSpecification = {
  firstBaseId?: string;
  length: number;
};

export function specifySide(side: Side): SideSpecification {
  if (side.length == 0) {
    return { length: 0 };
  }
  return {
    firstBaseId: side[0].id,
    length: side.length,
  };
}

// returns the specified side or undefined if the side specification
// is invalid for the given sequence
export function specifiedSide(seq: Sequence, spec: SideSpecification): Side | undefined {
  if (spec.length == 0) {
    return [];
  } else if (spec.firstBaseId == undefined) {
    return undefined;
  }

  let i1 = seq.bases.findIndex(b => b.id == spec.firstBaseId);
  if (i1 < 0) {
    return undefined;
  }

  let p1 = i1 + 1;
  if (p1 + spec.length - 1 > seq.length) {
    return undefined;
  }

  let side: Side = [];
  for (let i = 0; i < spec.length; i++) {
    let b = seq.atPosition(p1 + i);
    if (b) { // should never be undefined given the checks above
      side.push(b);
    }
  }
  return side;
}

export function sideSpecificationsAreEqual(spec1: SideSpecification, spec2: SideSpecification): boolean {
  return (
    spec1.firstBaseId == spec2.firstBaseId
    && spec1.length == spec2.length
  );
}
