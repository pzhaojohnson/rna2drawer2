import React from 'react';
import Infobar from './Infobar';

/**
 * @param {App} app 
 * 
 * @returns {React.Element} 
 */
function createInfobarForApp(app) {
  return (
    <Infobar
      drawingIsEmpty={app.strictDrawing.isEmpty()}
      zoom={app.strictDrawing.zoom}
      setZoom={z => {
        app.strictDrawing.zoom = z;
        app.renderInfobar();
      }}
    />
  );
}

export default createInfobarForApp;
