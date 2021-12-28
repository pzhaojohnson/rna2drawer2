import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { HomePage } from './HomePage';

it('renders', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.formContainer.renderForm(() => <HomePage app={app} />);
});
