import parseFileExtension from './parseFileExtension';

it('returns file extension', () => {
  expect(
    parseFileExtension('asdf.qwer')
  ).toBe('qwer');
});

it('handles no file extension', () => {
  expect(
    parseFileExtension('zxcvbn')
  ).toBe('zxcvbn');
});

it('handles empty file extension', () => {
  expect(
    parseFileExtension('asdf.')
  ).toBe('');
});

it('handles multiple periods', () => {
  expect(
    parseFileExtension('qwe.r.tyui.hj')
  ).toBe('hj');
});
