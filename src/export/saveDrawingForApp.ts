import { offerFileForDownload } from './offerFileForDownload';

interface StrictDrawing {
  savableString: string;
}

interface App {
  strictDrawing: StrictDrawing;
}

function saveDrawingForApp(app: App) {
  let name = 'Drawing';
  if (document.title) {
    name = document.title;
  }
  offerFileForDownload({
    name: name + '.rna2drawer2',
    type: 'text/plain',
    contents: app.strictDrawing.savableString,
  });
}

export default saveDrawingForApp;
