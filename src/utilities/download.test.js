import offerFileForDownload from './download';

describe('offerFileForDownload function', () => {
  it('returns early when file props are missing', () => {
    URL.createObjectURL = jest.fn();
    offerFileForDownload({ type: 'text/plain', contents: 'asdf' }); // missing name
    offerFileForDownload({ name: 'asdf.txt', contents: 'asdf' }); // missing type
    offerFileForDownload({ name: 'asdf.txt', type: 'text/plain' }); // missing contents
    // returned early for all of them
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
