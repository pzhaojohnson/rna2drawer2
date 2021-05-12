// a group of consecutive unpaired positions
export type UnpairedRegion = {
  // the position immediately 5' to the unpaired region
  boundingPosition5: number;
  // the position immediately 3' to the unpaired region
  boundingPosition3: number;
};

export function contains(ur: UnpairedRegion, p: number): boolean {
  return p > ur.boundingPosition5 && p < ur.boundingPosition3;
}
