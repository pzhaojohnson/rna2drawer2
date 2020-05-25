import positionIsInStem from './positionIsInStem';

it('positionIsInStem function', () => {
  let partners = [null, null, 11, 10, 9, null, null, null, 5, 4, 3, null];
  expect(positionIsInStem(5, partners)).toBeTruthy();
  expect(positionIsInStem(2, partners)).toBeFalsy();
  expect(positionIsInStem(7, partners)).toBeFalsy(); // in loop
});
