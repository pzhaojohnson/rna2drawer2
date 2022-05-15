import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import * as React from 'react';
import { CreateNewDrawing } from './CreateNewDrawing';

it('renders', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.formContainer.renderForm(close => <CreateNewDrawing app={app} close={close} />);
});
