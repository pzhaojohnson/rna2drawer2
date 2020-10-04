export interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function positionsOfStem(st: Stem): number[] {
  let ps = [] as number[];
  for (let i = 0; i < st.size; i++) {
    ps.push(st.position5 + i);
  }
  for (let i = 0; i < st.size; i++) {
    ps.push(st.position3 - st.size + 1 + i);
  }
  return ps;
}
