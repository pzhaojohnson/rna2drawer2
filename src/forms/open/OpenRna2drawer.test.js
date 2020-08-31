import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import React from 'react';
import { mount } from 'enzyme';
import { OpenRna2drawer } from './OpenRna2drawer';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('renders', () => {
  mount(<OpenRna2drawer app={app} close={jest.fn()} />);
});
