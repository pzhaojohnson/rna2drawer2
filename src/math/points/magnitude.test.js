import { magnitude2D } from './magnitude';

test('magnitude2D function', () => {
  [
    { v: { x: 5, y: 12 }, m: 13 },
    { v: { x: 4, y: 3 }, m: 5 },
    { v: { x: -11, y: 60 }, m: 61 },
    { v: { x: 35, y: -12 }, m: 37 },
    { v: { x: -3, y: -4 }, m: 5 },
    { v: { x: 0, y: 6 }, m: 6 },
    { v: { x: -8, y: 0 }, m: 8 },
    { v: { x: 0, y: 0 }, m: 0 },
  ].forEach(vm => {
    expect(magnitude2D(vm.v)).toBeCloseTo(vm.m);
  });
});
