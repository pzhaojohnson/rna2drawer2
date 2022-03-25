import type { Base } from 'Draw/bases/Base';

export function isNumbered(b: Base): boolean {
  return b.numbering ? true : false;
}
