const MENU_CONTAINER_ID = 'menuContainer';
const DRAWING_CONTAINER_ID = 'drawingContainer';
const FORM_CONTAINER_ID = 'formContainer';
const INFOBAR_CONTAINER_ID = 'infobarContainer';

function fillInBodyForApp() {
  let outermostDiv = document.createElement('div');
  outermostDiv.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
  outermostDiv.ondragstart = () => false;
  outermostDiv.ondrop = () => false;
  document.body.appendChild(outermostDiv);

  let menuContainer = document.createElement('div');
  menuContainer.id = MENU_CONTAINER_ID;
  outermostDiv.appendChild(menuContainer);

  let drawingAndFormDiv = document.createElement('div');
  drawingAndFormDiv.style.cssText = 'min-height: 0px; flex-grow: 1; display: flex; flex-direction: row;';
  outermostDiv.appendChild(drawingAndFormDiv);

  let drawingContainer = document.createElement('div');
  drawingContainer.id = DRAWING_CONTAINER_ID;
  drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
  drawingAndFormDiv.appendChild(drawingContainer);

  let formContainer = document.createElement('div');
  formContainer.id = FORM_CONTAINER_ID;
  drawingAndFormDiv.appendChild(formContainer);

  let infobarContainer = document.createElement('div');
  infobarContainer.id = INFOBAR_CONTAINER_ID;
  outermostDiv.appendChild(infobarContainer);
}

function getMenuContainer(): Element | null {
  return document.getElementById(MENU_CONTAINER_ID);
}

function getDrawingContainer(): Element | null {
  return document.getElementById(DRAWING_CONTAINER_ID);
}

function getFormContainer(): Element | null {
  return document.getElementById(FORM_CONTAINER_ID);
}

function getInfobarContainer(): Element | null {
  return document.getElementById(INFOBAR_CONTAINER_ID);
}

export {
  fillInBodyForApp,
  getMenuContainer,
  getDrawingContainer,
  getFormContainer,
  getInfobarContainer,
};
