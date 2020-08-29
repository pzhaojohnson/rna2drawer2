import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import * as React from 'react';
import { CreateNewDrawing } from './CreateNewDrawing';

it('renders', () => {
  let app = new App(() => NodeSVG());
  app.renderForm(close => <CreateNewDrawing app={app} close={close} />);
});
