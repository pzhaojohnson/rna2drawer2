import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { mount } from 'enzyme';
import { OpenSavedDrawingForm } from './OpenSavedDrawingForm';

let app = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
});

it('renders', () => {
  mount(<OpenSavedDrawingForm app={app} close={jest.fn()} />);
});
