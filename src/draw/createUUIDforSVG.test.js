import createUUIDforSVG from './createUUIDforSVG';

it('createUUIDforSVG', () => {
  let id0 = createUUIDforSVG();
  let id1 = createUUIDforSVG();
  let id2 = createUUIDforSVG();

  expect(id0).not.toEqual(id1);
  expect(id0).not.toEqual(id2);
  expect(id1).not.toEqual(id2);

  expect(Number(id0.charAt(0))).toBeNaN();
  expect(Number(id1.charAt(0))).toBeNaN();
  expect(Number(id2.charAt(0))).toBeNaN();
});
