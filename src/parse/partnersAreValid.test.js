import { partnersAreValid } from './partnersAreValid';

it('empty array', () => {
  expect(partnersAreValid([])).toBeTruthy();
});

it('a valid unpaired stretch', () => {
  expect(partnersAreValid([null, null, null])).toBeTruthy();
});

it('a valid hairpin', () => {
  expect(
    partnersAreValid([null, 10, 9, 8, null, null, null, 4, 3, 2])
  ).toBeTruthy();
});

it('a valid pseudoknot', () => {
  expect(
    partnersAreValid([9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4])
  ).toBeTruthy();
});

it('wrong types', () => {
  expect(partnersAreValid([null, 8, '7', null, null, null, 3, 2])).toBeFalsy();
  expect(partnersAreValid([null, undefined, null])).toBeFalsy();
});

it('a non-integer partners', () => {
  expect(partnersAreValid([null, 5.1, null, null, 2, null])).toBeFalsy();
});

it('partner is below bounds', () => {
  expect(partnersAreValid([null, null, 0, null])).toBeFalsy();
  expect(partnersAreValid([null, -5, null])).toBeFalsy();
});

it('partner is above bounds', () => {
  expect(partnersAreValid([null, 4, null])).toBeFalsy();
  expect(partnersAreValid([null, null, 9, null])).toBeFalsy();
});

it('partners disagree', () => {
  expect(partnersAreValid([null, null, null, null, 2, null])).toBeFalsy();
  expect(partnersAreValid([9, 8, 7, null, null, null, null, 3, 2, 1])).toBeFalsy();
});
