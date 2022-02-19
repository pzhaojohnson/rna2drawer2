import { sortNumbers } from './sortNumbers';

test('sortNumbers function', () => {
  let numbers = [50, 10, 620, 0.1, -5, 2000, 0, 1, 3, 1, 2, 55.5];
  let sortedNumbers = [-5, 0, 0.1, 1, 1, 2, 3, 10, 50, 55.5, 620, 2000];

  // cannot just call sort method with no compare function
  let numbersCopy = [...numbers];
  expect(numbersCopy.sort()).not.toEqual(sortedNumbers);

  let returnedNumbers = sortNumbers(numbers);
  expect(numbers).toStrictEqual(sortedNumbers); // sorted in place
  expect(returnedNumbers).toBe(numbers); // and returned numbers array
});
