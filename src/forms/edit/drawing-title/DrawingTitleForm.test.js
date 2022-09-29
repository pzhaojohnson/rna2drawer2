import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import * as React from 'react';

import { DrawingTitleForm } from './DrawingTitleForm';

let app = null;

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);
});

afterEach(() => {
  app.formContainer.unmountForm();
  app.remove();
  app = null;
});

describe('DrawingTitleForm component', () => {
  test('rendering', () => {
    app.formContainer.renderForm(props => (
      <DrawingTitleForm {...props} app={app} />
    ));
  });
});
