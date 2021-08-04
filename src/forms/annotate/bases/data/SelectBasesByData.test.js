import App from '../../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { SelectBasesByData } from './SelectBasesByData';

it('renders', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdfasdf');
  app.renderForm(close => <SelectBasesByData app={app} close={close} />);
});
