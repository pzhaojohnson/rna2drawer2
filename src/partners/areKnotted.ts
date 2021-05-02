export type Pair = [number, number];

/**
 * It is undefined whether two pairs are knotted
 * if a position is present in both pairs.
 */
export function areKnotted(pair1: Pair, pair2: Pair): boolean {
  let upstream = Math.min(...pair1) < Math.min(...pair2) ? pair1 : pair2;
  let downstream = upstream == pair1 ? pair2 : pair1;
  return (
    Math.min(...downstream) < Math.max(...upstream)
    && Math.max(...downstream) > Math.max(...upstream)
  );
}
