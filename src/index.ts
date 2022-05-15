import './global.css';
import { App } from 'App';

let app = new App();

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
