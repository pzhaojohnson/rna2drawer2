import type { Base } from 'Draw/bases/Base';

/**
 * Returns true if the base has numbering and false otherwise.
 */
export function isNumbered(b: Base): boolean {
  return b.numbering ? true : false;
}
