import stemOfPosition from './stemOfPosition';

let partners = [null, 12, 11, 10, 9, null, null, null, 5, 4, 3, 2, null, null];

it('position is not in stem', () => {
  expect(stemOfPosition(13, partners)).toBe(null);
  expect(stemOfPosition(6, partners)).toBe(null);
});

it("position is on 5' side of stem", () => {
  let st = stemOfPosition(3, partners);
  expect(st.position5).toBe(2);
  expect(st.position3).toBe(12);
  expect(st.size).toBe(4);
});

it("position is on 3' side of stem", () => {
  let st = stemOfPosition(10, partners);
  expect(st.position5).toBe(2);
  expect(st.position3).toBe(12);
  expect(st.size).toBe(4);
});

it('stem with just one base pair', () => {
  let partners = [null, 5, null, null, 2];
  let st = stemOfPosition(5, partners);
  expect(st.position5).toBe(2);
  expect(st.position3).toBe(5);
  expect(st.size).toBe(1);
});
