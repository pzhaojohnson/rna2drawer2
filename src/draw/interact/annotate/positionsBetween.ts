export function positionsBetween(inclusiveEnd1: number, inclusiveEnd2: number): number[] {
  let min = Math.min(inclusiveEnd1, inclusiveEnd2);
  let max = Math.max(inclusiveEnd1, inclusiveEnd2);
  let ps = [] as number[];
  for (let p = min; p <= max; p++) {
    ps.push(p);
  }
  return ps;
}

export default positionsBetween;
