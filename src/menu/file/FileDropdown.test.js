import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import React from 'react';
import { FileDropdown } from './FileDropdown';

it('renders', () => {
  let app = new App(() => NodeSVG());
  <FileDropdown app={app} />;
});
