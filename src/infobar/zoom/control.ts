import { round } from 'Math/round';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom, setZoom } from 'Draw/zoom';

const presetZooms = [0.05, 0.1, 0.25, 0.35, 0.5, 0.6, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];

export function nextLowestPresetZoom(z: number): number {
  // Account for floating point imprecision when calculating and setting zoom.
  // Otherwise, repeated calls to this function might always return the same value.
  z = round(z, 2);
  let lower = presetZooms.filter(pz => pz < z);
  if (lower.length > 0) {
    return Math.max(...lower);
  } else {
    return z; // no preset zoom is lower
  }
}

export function nextHighestPresetZoom(z: number): number {
  // Account for floating point imprecision when calculating and setting zoom.
  // Otherwise, repeated calls to this function might always return the same value.
  z = round(z, 2);
  let higher = presetZooms.filter(pz => pz > z);
  if (higher.length > 0) {
    return Math.min(...higher);
  } else {
    return z; // no preset zoom is higher
  }
}

export function zoomIn(drawing: Drawing) {
  let z = zoom(drawing);
  if (typeof z == 'number') {
    setZoom(drawing, nextHighestPresetZoom(z));
  } else {
    setZoom(drawing, 1);
  }
}

export function zoomOut(drawing: Drawing) {
  let z = zoom(drawing);
  if (typeof z == 'number') {
    setZoom(drawing, nextLowestPresetZoom(z));
  } else {
    setZoom(drawing, 1);
  }
}
