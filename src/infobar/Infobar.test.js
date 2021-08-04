import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Infobar } from './Infobar';

let app = null;
let container = null;

beforeEach(() => {
  app = new App(() => NodeSVG());

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('does not render when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  act(() => render(<Infobar app={app} />, container));
  expect(container.childNodes.length).toBe(0);
});

it('is visible when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  act(() => render(<Infobar app={app} />, container));
  expect(container.childNodes.length).toBeGreaterThan(0);
});
