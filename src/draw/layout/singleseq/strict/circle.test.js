import { circleCenter } from './circle';

it('more than semicircle - straight and polar distances are normal size', () => {
  let cc = circleCenter(
    0.16393202250021055,
    5.404226065180614,
    2.6360679774997897,
    5.404226065180614,
    22.61946710584651,
  );
  expect(cc.x).toBeCloseTo(1.4, 3);
  expect(cc.y).toBeCloseTo(1.6, 3);
});

it('less than semicircle - straight and polar distances are normal size', () => {
  let cc = circleCenter(-6.327564, -6.427564, -2.696434, -8.5239991, 4.241150);
  expect(cc.x).toBeCloseTo(-0.6, 3);
  expect(cc.y).toBeCloseTo(-0.7, 3);
});

it('straight and polar distances are zero', () => {
  let cc = circleCenter(0, 0.1, 0, 0.1, 0);
  expect(cc.x).toBeCloseTo(0.0005, 3);
  expect(cc.y).toBeCloseTo(0.09983169428170215, 3);
});

it('straight distance is zero and polar distance is negative', () => {
  let cc = circleCenter(0.5, 0.45, 0.5, 0.45, -0.005);
  expect(cc.x).toBeCloseTo(0.5005, 3);
  expect(cc.y).toBeCloseTo(0.44983169428170217, 3);
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
  expect(cc.x).toBeCloseTo(0.23047256350531417, 3);
  expect(cc.y).toBeCloseTo(0.34023454327587244, 3);
});

it('straight distance is very small and polar distance is negative', () => {
  let cc = circleCenter(-0.01, -0.02, -0.01000001, -0.02000001, -0.15);
  expect(cc.x).toBeCloseTo(-0.010472563505334502, 3);
  expect(cc.y).toBeCloseTo(-0.0202345432758314, 3);
});

it('more than semicircle - straight and polar distances are very small', () => {
  let cc = circleCenter(1, 2, 1.000001, 2, 0.000005);
  expect(cc.x).toBeCloseTo(1.0005, 3);
  expect(cc.y).toBeCloseTo(1.999831694281702, 3);
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

it('less than semicircle - straight distance is normal size and polar distance is zero', () => {
  let cc = circleCenter(10.1, 11.2, 15.2, 16.3, 0);
  expect(cc.x).toBeCloseTo(-75.740944, 3);
  expect(cc.y).toBeCloseTo(102.140944, 3);
});

it('less than semicircle - straight distance is normal size and polar distance is negative', () => {
  let cc = circleCenter(10.1, 11.2, 15.2, 16.3, -0.5);
  expect(cc.x).toBeCloseTo(-75.740944, 3);
  expect(cc.y).toBeCloseTo(102.140944, 3);
});

it('less than semicircle - straight distance is normal size and polar distance is very small', () => {
  let cc = circleCenter(10.1, 11.2, 15.2, 16.3, 0.000005);
  expect(cc.x).toBeCloseTo(-75.740944, 3);
  expect(cc.y).toBeCloseTo(102.140944, 3);
});

it('exactly (or very close to) a semicircle', () => {
  let cc = circleCenter(1, 2, 2, 2, Math.PI / 2);
  expect(cc.x).toBeCloseTo(1.5, 3);
  expect(cc.y).toBeCloseTo(2, 2);
});

it('slightly more than a semicircle', () => {
  let cc = circleCenter(-1, -1.5, -1, -3.5, Math.PI + 0.000001);
  expect(cc.x).toBeCloseTo(-1, 2);
  expect(cc.y).toBeCloseTo(-2.5, 3);
});

it('slightly less than a semicircle', () => {
  let cc = circleCenter(-2.2, 3.5, 1.8, 3.5, (2 * Math.PI) + 0.000001);
  expect(cc.x).toBeCloseTo(-0.2, 3);
  expect(cc.y).toBeCloseTo(3.5, 2);
});

it('more than semicircle - both distances are normal size but polar is much bigger', () => {
  let cc = circleCenter(1.2, 2.25, 2.5, 2.4, 123456);
  expect(cc.x).toBeCloseTo(2254.0808631254235, 3);
  expect(cc.y).toBeCloseTo(-19517.00914708702, 3);
});

it('less than semicircle - both distances are normal size but polar is much smaller', () => {
  let cc = circleCenter(-1e6, 1e6, 1e6, -1e6, 0.8);
  expect(cc.x).toBeCloseTo(2278480972.248471, 3);
  expect(cc.y).toBeCloseTo(2278480972.248471, 3);
});

it('less than semicircle - straight and polar distances are the same', () => {
  let cc = circleCenter(-0.5, 0.5, 0.5, 0.5, 1);
  expect(cc.x).toBeCloseTo(-1.110223e-16, 3);
  expect(cc.y).toBeCloseTo(6.944320, 3);
});

it('less than semicircle - polar distance is only slightly larger than straight distance', () => {
  let cc = circleCenter(-1, 1, 1, 1, 2.000001);
  expect(cc.x).toBeCloseTo(1.110223e-15, 3);
  expect(cc.y).toBeCloseTo(19.242355, 3);
});
