import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createNodeSVG from './draw/createNodeSVG';

it('instantiates without crashing', () => {
  let app = new App({ testing: true, testingDrawingContainer: createNodeSVG() });
});
