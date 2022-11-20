import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { OpenSavedDrawingForm } from './OpenSavedDrawingForm';

let app = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  app.remove();
  app = null;
});

describe('OpenSavedDrawingForm component', () => {
  it('renders', () => {
    let props = {
      app,
      close: jest.fn(),
    };
    render(<OpenSavedDrawingForm {...props} />, container);
  });
});
