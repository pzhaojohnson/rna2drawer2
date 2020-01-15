import parseSequenceId from './parseSequenceId';

it('parseSequenceId', () => {

  // no whitespace
  expect(parseSequenceId('asdf')).toBe('asdf');

  // leading whitespace
  expect(parseSequenceId(' \tasdf')).toBe('asdf');

  // trailing whitespace
  expect(parseSequenceId('asdf \t')).toBe('asdf');

  // intervening whitespace
  expect(parseSequenceId('as\t df')).toBe('as\t df');

  // whitespace everywhere
  expect(parseSequenceId('\t as  df\t\n')).toBe('as  df');

  // only whitespace
  expect(parseSequenceId(' \n\t ')).toBe('');
});
