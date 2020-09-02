const presetZooms = [0.05, 0.1, 0.25, 0.35, 0.5, 0.6, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];

export function nextLowestPresetZoom(z: number): number {
  let nextLowest = presetZooms[0];
  presetZooms.slice(1).forEach(pz => {
    if (pz < z && Math.abs(pz - z) > 0.01) {
      nextLowest = pz;
    }
  });
  return nextLowest;
}

export function nextHighestPresetZoom(z: number): number {
  let nextHighest = presetZooms[presetZooms.length - 1];
  for (let i = presetZooms.length - 2; i >= 0; i--) {
    let pz = presetZooms[i];
    if (pz > z && Math.abs(pz - z) > 0.01) {
      nextHighest = pz;
    }
  }
  return nextHighest;
}
