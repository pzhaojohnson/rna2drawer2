import { save } from './save';
import * as Download from 'Utilities/download';

it('calls offerFileForDownload function', () => {
  document.title = 'Name of Drawing';
  let app = {
    strictDrawing: {
      savableString: 'Savable Drawing State',
    },
  };
  Download.download = jest.fn();
  save(app);
  let c = Download.download.mock.calls[0];
  let fileProps = c[0];
  expect(fileProps.name).toBe('Name of Drawing.rna2drawer2');
  expect(fileProps.type).toBe('text/plain');
  expect(fileProps.contents).toBe('Savable Drawing State');
});
