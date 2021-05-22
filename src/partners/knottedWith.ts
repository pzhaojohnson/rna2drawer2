import { Partners, partnerOf } from './Partners';
import { Pair, partner5, partner3 } from './Pair';
import { areKnotted } from './areKnotted';

export function knottedWith(partners: Partners, pr: Pair): Pair[] {
  let knotted: Pair[] = [];
  let p5 = partner5(pr);
  let p3 = partner3(pr);
  for (let p = p5 + 1; p < p3; p++) {
    let q = partnerOf(partners, p);
    if (typeof q == 'number') {
      if (areKnotted(pr, [p, q])) {
        knotted.push([p, q]);
      }
    }
  }
  return knotted;
}
