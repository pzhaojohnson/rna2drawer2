import { interpretNumericValue } from './interpretNumericValue';

test('interpretNumericValue function', () => {
  let n = interpretNumericValue(5.8);
  expect(n.valueOf()).toBe(5.8);

  n = interpretNumericValue('125px');
  expect(n.valueOf()).toBe(125);

  n = interpretNumericValue('78.72%');
  expect(n.valueOf()).toBe(0.7872);
});
