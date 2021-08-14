import { AppInterface as App } from '../AppInterface';
import { download } from 'Utilities/download';

export function save(app: App) {
  let name = 'Drawing';
  if (document.title) {
    name = document.title;
  }
  download({
    name: name + '.rna2drawer2',
    type: 'text/plain',
    contents: app.strictDrawing.savableString,
  });
}
