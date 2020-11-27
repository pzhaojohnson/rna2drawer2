import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import React from 'react';
import { HomePage } from './HomePage';

it('renders', () => {
  let app = new App(() => NodeSVG());
  app.renderForm(() => <HomePage app={app} />);
});
