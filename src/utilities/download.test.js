import { download } from './download';

describe('download function', () => {
  it('returns early when file props are missing', () => {
    URL.createObjectURL = jest.fn();
    download({ type: 'text/plain', contents: 'asdf' }); // missing name
    download({ name: 'asdf.txt', contents: 'asdf' }); // missing type
    download({ name: 'asdf.txt', type: 'text/plain' }); // missing contents
    // returned early for all of them
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
