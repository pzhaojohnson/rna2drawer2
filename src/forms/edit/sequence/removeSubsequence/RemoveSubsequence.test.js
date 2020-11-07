import React from 'react';
import App from '../../../../App';
import NodeSVG from '../../../../draw/NodeSVG';
import { RemoveSubsequence } from './RemoveSubsequence';

it('renders', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdfasdf');
  app.renderForm(close => <RemoveSubsequence app={app} close={close} />);
});
