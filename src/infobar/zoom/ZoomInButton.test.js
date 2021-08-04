import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ZoomInButton } from './ZoomInButton';

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

it('darkens on hover and lightens on dehover', () => {
  act(() => render(<ZoomInButton app={app} />, container));
  let b = container.childNodes[0];
  expect(b.style.backgroundColor).toBe('transparent');
  fireEvent(b, new MouseEvent('mouseover', { bubbles: true }));
  expect(b.style.backgroundColor).toBe('gainsboro');
  fireEvent(b, new MouseEvent('mouseout', { bubbles: true }));
  expect(b.style.backgroundColor).toBe('transparent');
});

it('increases zoom on click', () => {
  act(() => render(<ZoomInButton app={app} />, container));
  let b = container.childNodes[0];
  app.strictDrawing.zoom = 1.8;
  expect(app.strictDrawing.zoom).toBeCloseTo(1.8);
  fireEvent(b, new MouseEvent('click', { bubbles: true }));
  expect(app.strictDrawing.zoom).toBeGreaterThan(1.8);
  expect(app.strictDrawing.zoom).not.toBeCloseTo(1.8);
});
