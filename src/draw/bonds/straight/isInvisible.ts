import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { interpretNumber } from 'Draw/svg/interpretNumber';

// checks if the opacity of its line element is zero
export function isInvisible(sb: StraightBond): boolean {
  let o = interpretNumber(sb.line.attr('opacity'));
  if (o) {
    return o.valueOf() == 0;
  } else {
    return false;
  }
}
