import polarizeLength from './polarizeLength';

it('polarizeLength', () => {

  // basically just check to see if it runs without throwing anything
  polarizeLength(10);

  // should be able to handle an input length of zero
  polarizeLength(0);
});
