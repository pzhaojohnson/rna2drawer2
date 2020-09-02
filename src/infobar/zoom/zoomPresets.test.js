import { nextLowestPresetZoom, nextHighestPresetZoom } from './zoomPresets';

describe('nextLowestPresetZoom function', () => {
  it('given zoom is in between two presets', () => {
    expect(nextLowestPresetZoom(1.75)).toBe(1.5);
  });

  it('given zoom is lower than the lowest preset', () => {
    expect(nextLowestPresetZoom(0)).toBe(0.05);
  });

  it('given zoom is higher than the highest preset', () => {
    expect(nextLowestPresetZoom(1000)).toBe(10);
  });

  it('skips a preset when the given zoom is only slightly higher', () => {
    expect(nextLowestPresetZoom(1.00001)).toBe(0.9);
  });
});

describe('nextHighestPresetZoom function', () => {
  it('given zoom is in between two presets', () => {
    expect(nextHighestPresetZoom(1.75)).toBe(2);
  });

  it('given zoom is lower than the lowest preset', () => {
    expect(nextHighestPresetZoom(0)).toBe(0.05);
  });

  it('given zoom is higher than the highest preset', () => {
    expect(nextHighestPresetZoom(1000)).toBe(10);
  });

  it('skips a preset when the given zoom is only slightly lower', () => {
    expect(nextHighestPresetZoom(0.9999)).toBe(1.1);
  });
});
