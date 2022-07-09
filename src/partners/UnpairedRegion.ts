// a group of consecutive unpaired positions
export type UnpairedRegion = {
  // the position immediately 5' to the unpaired region
  boundingPosition5: number;
  // the position immediately 3' to the unpaired region
  boundingPosition3: number;
};

// returns the number of positions in the unpaired region
export function size(ur: UnpairedRegion): number {
  return ur.boundingPosition3 - ur.boundingPosition5 - 1;
}
