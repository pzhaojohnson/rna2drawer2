import { round } from 'Math/round';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom, setZoom } from 'Draw/zoom';

const presetZooms = [0.05, 0.1, 0.25, 0.35, 0.5, 0.6, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];

// returns undefined when there is no lower preset zoom
export function nextLowestPresetZoom(z: number): number | undefined {
  // Account for floating point imprecision when calculating and setting zoom.
  // Otherwise, repeated calls to this function might always return the same value.
  z = round(z, 2);
  let lower = presetZooms.filter(pz => pz < z);
  if (lower.length > 0) {
    return Math.max(...lower);
  } else {
    return undefined;
  }
}

// returns undefined when there is no higher preset zoom
export function nextHighestPresetZoom(z: number): number | undefined {
  // Account for floating point imprecision when calculating and setting zoom.
  // Otherwise, repeated calls to this function might always return the same value.
  z = round(z, 2);
  let higher = presetZooms.filter(pz => pz > z);
  if (higher.length > 0) {
    return Math.min(...higher);
  } else {
    return undefined;
  }
}

export function zoomIn(drawing: Drawing) {
  let z = zoom(drawing);
  if (typeof z != 'number') {
    setZoom(drawing, 1); // reset zoom
  } else {
    let nextHighest = nextHighestPresetZoom(z);
    if (typeof nextHighest == 'number') {
      setZoom(drawing, nextHighest);
    }
  }
}

export function zoomOut(drawing: Drawing) {
  let z = zoom(drawing);
  if (typeof z != 'number') {
    setZoom(drawing, 1); // reset zoom
  } else {
    let nextLowest = nextLowestPresetZoom(z);
    if (typeof nextLowest == 'number') {
      setZoom(drawing, nextLowest);
    }
  }
}
