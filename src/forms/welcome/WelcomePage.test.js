import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { WelcomePage } from './WelcomePage';

it('renders', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.formContainer.renderForm(() => <WelcomePage app={app} />);
});
