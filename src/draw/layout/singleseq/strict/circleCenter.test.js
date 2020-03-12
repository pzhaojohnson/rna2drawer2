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
  let cc = circleCenter(0, 0.1, 0, 0.1, 0);
  expect(cc.x).toBeCloseTo(0.001, 3);
  expect(cc.y).toBeCloseTo(0.100075, 3);
});

it('straight distance is zero and polar distance is negative', () => {
  let cc = circleCenter(0.5, 0.45, 0.5, 0.45, -0.005);
  expect(cc.x).toBeCloseTo(0.501, 3);
  expect(cc.y).toBeCloseTo(0.450075, 3);
});

it('straight distance is zero and polar distance is very small', () => {
  let cc = circleCenter(-0.33, 0.33, -0.33, 0.33, 1e-8);
  expect(cc.x).toBeCloseTo(-0.3295, 3);
  expect(cc.y).toBeCloseTo(0.329682, 3);
});

it('more than semicircle - straight distance is zero and polar distance is normal size', () => {
  let cc = circleCenter(-0.65, -0.4, -0.65, -0.4, 0.9);
  expect(cc.x).toBeCloseTo(-0.6495, 3);
  expect(cc.y).toBeCloseTo(-0.543421, 3);
});

it('straight distance is very small and polar distance is zero', () => {
  let cc = circleCenter(0.23, 0.34, 0.23000001, 0.34000001, 0);
  expect(cc.x).toBeCloseTo(0.230653, 3);
  expect(cc.y).toBeCloseTo(0.340760, 3);
});

it('straight distance is very small and polar distance is negative', () => {
  let cc = circleCenter(-0.01, -0.02, -0.01000001, -0.02000001, -0.15);
  expect(cc.x).toBeCloseTo(-0.010653, 3);
  expect(cc.y).toBeCloseTo(-0.020760, 3);
});

it('more than semicircle - straight and polar distances are very small', () => {
  let cc = circleCenter(1, 2, 1.000001, 2, 0.000005);
  expect(cc.x).toBeCloseTo(1.0005, 3);
  expect(cc.y).toBeCloseTo(1.999682, 3);
});

it('less than semicircle - straight and polar distances are very small', () => {
  let cc = circleCenter(1, 2, 1.000001, 2, 0.000001);
  expect(cc.x).toBeCloseTo(1.001, 3);
  expect(cc.y).toBeCloseTo(2.000075, 3);
});

it('more than semicircle - straight distance is very small and polar distance is normal size', () => {
  let cc = circleCenter(0.5000001, 0.6000001, 0.5, 0.6, 1.22);
  expect(cc.x).toBeCloseTo(0.362219, 3);
  expect(cc.y).toBeCloseTo(0.737073, 3);
});

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
