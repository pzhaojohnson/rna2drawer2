import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createNodeSVG from './draw/createNodeSVG';

it('renders', () => {
  new App(() => createNodeSVG());
});
