import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { InsertSubsequence } from './InsertSubsequence';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';

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
  app.strictDrawing.appendSequence('asdf', 'asdfasdf');
  render(
    <InsertSubsequence app={app} close={jest.fn()} />,
    container,
  );
});
