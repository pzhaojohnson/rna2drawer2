import * as React from 'react';
import Infobar from './Infobar';
import App from '../App';

function createInfobarForApp(app: App): React.ReactElement {
  return (
    <Infobar
      drawingIsEmpty={app.strictDrawing.isEmpty()}
      zoom={app.strictDrawing.zoom}
      setZoom={(z: number) => {
        app.strictDrawing.zoom = z;
        app.renderInfobar();
      }}
    />
  );
}

export default createInfobarForApp;
