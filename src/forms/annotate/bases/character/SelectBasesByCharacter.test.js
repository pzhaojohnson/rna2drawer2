import App from '../../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { SelectBasesByCharacter } from './SelectBasesByCharacter';

it('renders', () => {
  let app = new App(() => NodeSVG());
  app.renderForm(close => (
    <SelectBasesByCharacter app={app} close={close} />
  ));
});
