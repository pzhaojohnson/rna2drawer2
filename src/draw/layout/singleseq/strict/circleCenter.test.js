import circleCenter from './circleCenter';

/* These tests assume that the polarizeLength function works
by multiplying a straight length by 1.15. */

/* These tests also make assumptions about the values used
when the straight or polar distances are not normal size. */

it('more than semicircle - straight and polar distances are normal size', () => {
  let cc = circleCenter(1.2, 1.5, 2.5, 2.5, 3.8);
  expect(cc.x).toBeCloseTo(2.08335595985288, 3);
  expect(cc.y).toBeCloseTo(1.6966372521912565, 3);
});

it('less than semicircle - straight and polar distances are normal size', () => {
  let cc = circleCenter(-6.327564, -6.427564, -2.696434, -8.5239991, 4.241150);
  expect(cc.x).toBeCloseTo(-0.6, 3);
  expect(cc.y).toBeCloseTo(-0.7, 3);
});

it('straight and polar distances are zero', () => {
  let cc = circleCenter(0, 0, 0, 0, 0);
  expect(cc.x).toBeCloseTo(0.001, 3);
  expect(cc.y).toBeCloseTo(0.000075, 3);
});

it('straight distance is zero and polar distance is negative', () => {
  let cc = circleCenter(0.5, 0.5, 0.5, 0.5, -0.005);
  expect(cc.x).toBeCloseTo(0.501, 3);
  expect(cc.y).toBeCloseTo(0.500075, 3);
});

it('straight distance is zero and polar distance is very small', () => {
  let cc = circleCenter(-0.33, 0.33, -0.33, 0.33, 1e-8);
  expect(cc.x).toBeCloseTo(-0.3295, 3);
  expect(cc.y).toBeCloseTo(0.329682, 3);
});

it('more than semicircle - straight distance is zero and polar distance is normal size', () => {});

it('straight distance is very small and polar distance is zero', () => {});

it('straight distance is very small and polar distance is negative', () => {});

it('more than semicircle - straight and polar distances are very small', () => {});

it('less than semicircle - straight and polar distances are very small', () => {});

it('more than semicircle - straight distance is very small and polar distance is normal size', () => {});

it('less than semicircle - straight distance is normal size and polar distance is zero', () => {});

it('less than semicircle - straight distance is normal size and polar distance is negative', () => {});

it('less than semicircle - straight distance is normal size and polar distance is very small', () => {});

it('exactly (or very close to) a semicircle', () => {});

it('slightly more than a semicircle', () => {});

it('slightly less than a semicircle', () => {});

it('more than semicircle - both distances are normal size but polar is much bigger', () => {});

it('less than semicircle - both distances are normal size but polar is much smaller', () => {});

it('less than semicircle - straight and polar distances are the same', () => {});

it('less than semicircle - polar distance is only slightly larger than straight distance', () => {});
