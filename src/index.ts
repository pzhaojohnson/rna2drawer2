import './global.css';
import { App } from 'App';

let app = new App();

window.addEventListener('beforeunload', event => {
  let preference = app.preferences.askBeforeLeaving;
  if (preference != undefined && !preference) {
    return;
  } else if (app.strictDrawing.isEmpty()) {
    return;
  } else {
    let confirmationMessage = 'Are you sure?';
    (event || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
});
