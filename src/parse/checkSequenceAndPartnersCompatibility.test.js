import checkSequenceAndPartnersCompatibility from './checkSequenceAndPartnersCompatibility';

it('checkSequenceAndPartnersCompatibility', () => {

  // same lengths
  expect(() => checkSequenceAndPartnersCompatibility(
    'aaaa',
    [null, null, null, null]
  )).not.toThrow();

  // sequence is shorter
  expect(() => checkSequenceAndPartnersCompatibility(
    'aaa',
    [null, null, null, null]
  )).toThrow()

  // sequence is longer
  expect(() => checkSequenceAndPartnersCompatibility(
    'aaaaa',
    [null, null, null, null]
  )).toThrow()

  // empty
  expect(() => checkSequenceAndPartnersCompatibility(
    '',
    []
  )).not.toThrow();
});
