import { areClose } from './areClose';

it('positive numbers', () => {
  let n1 = 8;
  let n2 = 8 + 1e-6;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 6 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 5 })).toBeTruthy();

  n1 = 100;
  n2 = 100 - 1e-12;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 12 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 11 })).toBeTruthy();
});

it('negative numbers', () => {
  let n1 = -50.2 + 1e-5;
  let n2 = -50.2;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 5 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 4 })).toBeTruthy();

  n1 = -30;
  n2 = -30 + 1e-10;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 10 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 9 })).toBeTruthy();
});

it('close to zero', () => {
  let n1 = 0;
  let n2 = 1e-10;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 10 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 9 })).toBeTruthy();

  n1 = -1e-6;
  n2 = 0;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 6 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 5 })).toBeTruthy();

  n1 = 1e-8;
  n2 = -1e-8;
  expect(areClose(n1, n2)).toBeTruthy();
  expect(areClose(n1, n2, { places: 8 })).toBeFalsy();
  expect(areClose(n1, n2, { places: 7 })).toBeTruthy();
});
