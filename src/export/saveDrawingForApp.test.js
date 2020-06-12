import saveDrawingForApp from './saveDrawingForApp';
import * as OfferFileForDownload from './offerFileForDownload';

it('calls offerFileForDownload function', () => {
  document.title = 'Name of Drawing';
  let app = {
    strictDrawing: {
      savableString: 'Savable Drawing State',
    },
  };
  OfferFileForDownload.offerFileForDownload = jest.fn();
  saveDrawingForApp(app);
  let c = OfferFileForDownload.offerFileForDownload.mock.calls[0];
  let fileProps = c[0];
  expect(fileProps.name).toBe('Name of Drawing.rna2drawer2');
  expect(fileProps.type).toBe('text/plain');
  expect(fileProps.contents).toBe('Savable Drawing State');
});
