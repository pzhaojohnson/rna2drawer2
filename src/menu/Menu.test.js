import React from 'react';
import App from '../App';
import NodeSVG from '../draw/NodeSVG';
import { Menu } from './Menu';

it('renders', () => {
  let app = new App(() => NodeSVG());
  <Menu app={app} />;
});
