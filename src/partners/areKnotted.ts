import { Pair, partner5, partner3 } from './Pair';

// It is undefined whether two pairs are knotted
// if a position is present in both pairs.
export function areKnotted(pr1: Pair, pr2: Pair): boolean {
  let upstream = partner5(pr1) < partner5(pr2) ? pr1 : pr2;
  let downstream = upstream == pr1 ? pr2 : pr1;
  return (
    partner5(downstream) < partner3(upstream)
    && partner3(downstream) > partner3(upstream)
  );
}
