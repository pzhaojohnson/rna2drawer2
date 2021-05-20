import { Partners, partnerOf } from './Partners';
import { areKnotted } from './areKnotted';

export type Pair = [number, number];

export function knottedWith(partners: Partners, pair: Pair): Pair[] {
  let knotted: Pair[] = [];
  let u = Math.min(...pair);
  let d = Math.max(...pair);
  for (let p = u + 1; p < d; p++) {
    let q = partnerOf(partners, p);
    if (typeof q == 'number') {
      if (areKnotted(pair, [p, q])) {
        knotted.push([p, q]);
      }
    }
  }
  return knotted;
}
