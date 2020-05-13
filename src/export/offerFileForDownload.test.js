import offerFileForDownload from './offerFileForDownload';

describe('returns early on missing file props', () => {
  let createObjectURL = jest.fn();
  URL.createObjectURL = createObjectURL;

  it('missing name', () => {
    offerFileForDownload({
      type: 'text/plain',
      contents: 'asdf',
    });
    expect(createObjectURL.mock.calls.length).toBe(0);
  });

  it('missing type', () => {
    offerFileForDownload({
      name: 'asdf.txt',
      contents: 'asdf',
    });
    expect(createObjectURL.mock.calls.length).toBe(0);
  });

  it('missing contents', () => {
    offerFileForDownload({
      name: 'asdf.txt',
      type: 'text/plain',
    });
    expect(createObjectURL.mock.calls.length).toBe(0);
  });
});
