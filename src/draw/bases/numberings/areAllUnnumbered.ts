import type { Base } from 'Draw/bases/Base';

// Returns true if none of the given bases have numberings
// and false otherwise.
//
// Currently, returns true for an empty array, though
// it is not firmly defined what should be returned
// for an empty array.
export function areAllUnnumbered(bs: Base[]): boolean {
  return bs.every(b => !b.numbering);
}
