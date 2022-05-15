import './global.css';
import { App } from 'App';

let app = new App();

// disable drag and drop
document.body.ondragstart = () => false;
document.body.ondrop = () => false;

// ask for confirmation before leaving if the drawing is nonempty
// and the app preference is set to do so
window.addEventListener('beforeunload', event => {
  if (app.drawing.isEmpty()) {
    return;
  }

  let askBeforeLeaving = app.preferences.askBeforeLeaving;
  if (askBeforeLeaving != undefined && !askBeforeLeaving) {
    // only if explicitly set to false
    return;
  }

  let message = 'Are you sure?';
  (event || window.event).returnValue = message;
  return message;
});
