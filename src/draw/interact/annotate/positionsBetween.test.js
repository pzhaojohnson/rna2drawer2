import positionsBetween from './positionsBetween';

it('end 1 is less than end2', () => {
  let ps = positionsBetween(5, 12);
  expect(ps.length).toBe(8);
  for (let p = 5; p <= 12; p++) {
    expect(ps.includes(p)).toBeTruthy();
  }
});

it('end 1 is greater than end 2', () => {
  let ps = positionsBetween(22, 18);
  expect(ps.length).toBe(5);
  for (let p = 18; p <= 22; p++) {
    expect(ps.includes(p)).toBeTruthy();
  }
});
