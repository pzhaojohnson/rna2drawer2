import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { EditDrawingTitle } from './EditDrawingTitle';

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

it('renders', () => {
  let app = new App(() => NodeSVG());
  act(() => {
    render(<EditDrawingTitle app={app} />, container);
  });
});
