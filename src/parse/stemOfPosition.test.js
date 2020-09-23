import { parseDotBracket } from './parseDotBracket';
import { stemOfPosition } from './stemOfPosition';

let partners = parseDotBracket('((..))..(((..))).((((....))))...(.)').secondaryPartners;

it('position is out of range', () => {
  expect(stemOfPosition(0, partners)).toBe(null); // just below range
  expect(stemOfPosition(1, partners)).toBeTruthy(); // start of range
  expect(stemOfPosition(partners.length, partners)).toBeTruthy(); // end of range
  expect(stemOfPosition(partners.length + 1, partners)).toBe(null); // just above range
});

it('position is not in stem', () => {
  expect(stemOfPosition(8, partners)).toBe(null);
  expect(stemOfPosition(12, partners)).toBe(null);
});

it("position is on 5' side of stem", () => {
  let st = stemOfPosition(10, partners);
  expect(st.position5).toBe(9);
  expect(st.position3).toBe(16);
  expect(st.size).toBe(3);
});

it("position is on 3' side of stem", () => {
  let st = stemOfPosition(28, partners);
  expect(st.position5).toBe(18);
  expect(st.position3).toBe(29);
  expect(st.size).toBe(4);
});

it('stem with just one base pair', () => {
  let partners = [null, 5, null, null, 2];
  let st = stemOfPosition(5, partners);
  expect(st.position5).toBe(2);
  expect(st.position3).toBe(5);
  expect(st.size).toBe(1);
});
