import positionIsInUnpairedRegion from './positionIsInUnpairedRegion';

it('positionIsInUnpairedRegion function', () => {
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3];
  expect(positionIsInUnpairedRegion(2, partners)).toBeTruthy();
  expect(positionIsInUnpairedRegion(4, partners)).toBeFalsy();
  expect(positionIsInUnpairedRegion(8, partners)).toBeTruthy();
});
