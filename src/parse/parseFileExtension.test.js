import parseFileExtension, { removeFileExtension } from './parseFileExtension';

describe('parseFileExtension function', () => {
  it('returns file extension', () => {
    expect(
      parseFileExtension('asdf.qwer')
    ).toBe('qwer');
  });

  it('handles no file extension', () => {
    expect(
      parseFileExtension('zxcvbn')
    ).toBe('');
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

  it('handles empty string', () => {
    expect(
      parseFileExtension('')
    ).toBe('');
  });
});

describe('removeFileExtension function', () => {
  it('file name has an extension', () => {
    expect(removeFileExtension('asdf.qwe')).toBe('asdf');
  });

  it('file name has no extension', () => {
    expect(removeFileExtension('ASDFzx')).toBe('ASDFzx');
  });

  it('empty string', () => {
    expect(removeFileExtension('')).toBe('');
  });

  it('empty file extension', () => {
    // still removes period
    expect(removeFileExtension('QQwweR.')).toBe('QQwweR');
  });

  it('multiple periods', () => {
    expect(removeFileExtension('qW.EERtb.tkh.lkopoq')).toBe('qW.EERtb.tkh');
  });
});
