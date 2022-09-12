import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import * as React from 'react';
import { EnterDotBracketForm } from './EnterDotBracketForm';

it('renders', () => {
  let app = new App({ SVG: { SVG: NodeSVG } });
  app.formContainer.renderForm(close => <EnterDotBracketForm app={app} close={close} />);
});
