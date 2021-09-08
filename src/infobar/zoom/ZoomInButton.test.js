import { ZoomInButton } from './ZoomInButton';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import App from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { resize } from 'Draw/dimensions';
import { zoom, setZoom } from 'Draw/zoom';

let app = new App(() => NodeSVG());

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

describe('ZoomInButton component', () => {
  it('zooms in on click', () => {
    resize(app.strictDrawing.drawing, { width: 200, height: 300 });
    let curr = 0.6;
    setZoom(app.strictDrawing.drawing, curr);
    act(() => {
      render(<ZoomInButton app={app} />, container);
    });
    // repeated clicks
    for (let i = 0; i < 5; i++) {
      let prev = curr;
      fireEvent(container.firstChild, new MouseEvent('click', { bubbles: true }));
      curr = zoom(app.strictDrawing.drawing);
      expect(curr).toBeGreaterThan(prev);
      prev = curr;
    }
  });
});
