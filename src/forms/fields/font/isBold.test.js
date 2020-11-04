import { isBold } from './isBold';

it('a string', () => {
  expect(isBold('normal')).toBeFalsy();
  expect(isBold('bold')).toBeTruthy();

  // 'bolder' could have less weight than 'bold' since it depends on the parent
  expect(isBold('bolder')).toBeFalsy();
});

it('a number', () => {
  expect(isBold(250)).toBeFalsy();
  expect(isBold(400)).toBeFalsy();
  expect(isBold(700)).toBeTruthy();
  expect(isBold(900)).toBeTruthy();
});
