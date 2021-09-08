import { ZoomDisplay } from './ZoomDisplay';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
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

describe('ZoomDisplay component', () => {
  it('displays the current zoom', () => {
    resize(app.strictDrawing.drawing, { width: 200, height: 100 });
    setZoom(app.strictDrawing.drawing, 1.25);
    act(() => {
      render(<ZoomDisplay app={app} />, container);
    });
    expect(container.textContent).toBe('125%');
  });

  test('when zoom is undefined', () => {
    resize(app.strictDrawing.drawing, { width: 0, height: 0 });
    expect(zoom(app.strictDrawing.drawing)).toBe(undefined);
    act(() => {
      render(<ZoomDisplay app={app} />, container);
    });
    expect(container.textContent).toBe('0%');
  });
});
