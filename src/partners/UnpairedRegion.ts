// a group of consecutive unpaired positions
export type UnpairedRegion = {
  // the position immediately 5' to the unpaired region
  boundingPosition5: number;
  // the position immediately 3' to the unpaired region
  boundingPosition3: number;
};

// returns the positions in the unpaired region
export function positions(ur: UnpairedRegion): number[] {
  let ps: number[] = [];
  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    ps.push(p);
  }
  return ps;
}

export function contains(ur: UnpairedRegion, p: number): boolean {
  return p > ur.boundingPosition5 && p < ur.boundingPosition3;
}
