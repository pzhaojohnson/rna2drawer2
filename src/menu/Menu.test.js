import React from 'react';
import App from '../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Menu } from './Menu';

it('renders', () => {
  let app = new App(() => NodeSVG());
  <Menu app={app} />;
});
