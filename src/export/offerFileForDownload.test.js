import offerFileForDownload from './offerFileForDownload';

describe('returns early on missing file props', () => {
  URL.createObjectURL = jest.fn();

  it('missing name', () => {
    offerFileForDownload({
      type: 'text/plain',
      contents: 'asdf',
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('missing type', () => {
    offerFileForDownload({
      name: 'asdf.txt',
      contents: 'asdf',
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('missing contents', () => {
    offerFileForDownload({
      name: 'asdf.txt',
      type: 'text/plain',
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
