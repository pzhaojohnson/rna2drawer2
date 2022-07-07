import { Partners } from './Partners';
import { Stem } from 'Partners/stems/Stem';
import { containingStem } from './containing';

// returns all stems formed by the pairs in the partners notation
export function stems(partners: Partners): Stem[] {
  let sts: Stem[] = [];
  let p = 1;
  while (p <= partners.length) {
    let st = containingStem(partners, p);
    if (!st) { // position is unpaired
      p++;
    } else if (p != st.position5) { // already encountered this stem
      p++;
    } else {
      sts.push(st);
      p = Math.max(
        st.position5 + st.size,
        p + 1, // just in case to prevent infinite looping
      );
    }
  }
  return sts;
}
