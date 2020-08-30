import { AppInterface as App } from '../AppInterface';
import { offerFileForDownload } from './offerFileForDownload';

export function save(app: App) {
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
