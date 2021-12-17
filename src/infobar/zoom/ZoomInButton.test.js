import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { resize } from 'Draw/dimensions';
import { zoom, setZoom } from 'Draw/zoom';

import { ZoomInButton } from './ZoomInButton';

let app = null;
let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  app = null;
});

test('ZoomInButton component', () => {
  act(() => {
    render(<ZoomInButton app={app} />, container);
  });

  let drawing = app.strictDrawing.drawing;
  resize(drawing, { width: 200, height: 300 });

  [0.2, 0.5, 1, 1.6, 3.8, 6.25].forEach(z => {
    setZoom(drawing, z);
    // click zoom in button
    fireEvent(container.firstChild, new MouseEvent('click', { bubbles: true }));
    // zoomed in
    expect(zoom(drawing)).toBeGreaterThan(z);
  });

  // should be higher than any preset zoom
  let z = 1000;
  setZoom(drawing, z);
  // click zoom in button
  fireEvent(container.firstChild, new MouseEvent('click', { bubbles: true }));
  // maintained zoom
  expect(zoom(drawing)).toBeCloseTo(z, 6);
});
