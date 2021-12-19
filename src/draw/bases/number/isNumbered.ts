import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

export function isNumbered(b: Base): boolean {
  return b.numbering ? true : false;
}
