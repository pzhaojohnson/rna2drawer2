import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { ZoomAdjust } from './ZoomAdjust';

let app = new App(() => NodeSVG());

// drawing dimensions must be nonzero for zoom to be set
app.strictDrawing.drawing.setWidthAndHeight(250, 250);

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('shows current zoom', () => {
  app.strictDrawing.zoom = 1.25;
  act(() => render(<ZoomAdjust app={app} />, container));
  expect(container.textContent.includes('125%')).toBeTruthy();
});
