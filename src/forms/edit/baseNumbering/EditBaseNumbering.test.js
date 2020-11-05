import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from 'react-dom';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { EditBaseNumbering, getBaseNumberings } from './EditBaseNumbering';

let container = null;

let app = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  app = new App(() => NodeSVG());
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  app = null;
});

it('renders when there are no base numberings', () => {
  let drawing = app.strictDrawing.drawing;
  expect(getBaseNumberings(drawing).length).toBe(0);
  act(() => {
    render(
      <EditBaseNumbering app={app} close={jest.fn()} />,
      container,
    );
  });
});

it('renders when there are base numberings', () => {
  app.strictDrawing.appendSequence('asdf', 'asdfasdfasdfasdfasdfasdf');
  let drawing = app.strictDrawing.drawing;
  let seq = drawing.getSequenceById('asdf');
  seq.numberingIncrement = 3;
  expect(getBaseNumberings(drawing).length).toBeGreaterThan(0);
  act(() => {
    render(
      <EditBaseNumbering app={app} close={jest.fn()} />,
      container,
    );
  });
});

it('binds close callback', () => {
  let close = jest.fn();
  let form = EditBaseNumbering({ app: app, close: close });
  expect(form.props.close).toBe(close);
});
