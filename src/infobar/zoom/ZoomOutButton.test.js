import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { resize } from 'Draw/dimensions';
import { zoom, setZoom } from 'Draw/zoom';

import { ZoomOutButton } from './ZoomOutButton';

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

test('ZoomOutButton component', () => {
  act(() => {
    render(<ZoomOutButton app={app} />, container);
  });

  let drawing = app.strictDrawing.drawing;
  resize(drawing, { width: 200, height: 300 });

  [0.41, 0.8, 1, 2.5, 6.2, 8].forEach(z => {
    setZoom(drawing, z);
    // click zoom out button
    fireEvent(container.firstChild, new MouseEvent('click', { bubbles: true }));
    // zoomed out
    expect(zoom(drawing)).toBeLessThan(z);
  });

  // should be lower than any preset zoom
  let z = 0.00001;
  setZoom(drawing, z);
  // click zoom out button
  fireEvent(container.firstChild, new MouseEvent('click', { bubbles: true }));
  // maintained zoom
  expect(zoom(drawing)).toBeCloseTo(z, 6);
});
