import * as React from 'react';
import EditLayout from './EditLayout';
import App from '../../../App';

function renderEditLayoutInApp(app: App) {
  app.renderForm(() => {
    let generalProps = app.strictDrawing.generalLayoutProps();
    return (
      <EditLayout
        rotation={generalProps.rotation}
        terminiGap={generalProps.terminiGap}
        apply={props => {
          app.pushUndo();
          generalProps.rotation = props.rotation;
          generalProps.terminiGap = props.terminiGap;
          app.strictDrawing.setGeneralLayoutProps(generalProps);
          app.strictDrawing.applyLayout();
          app.drawingChangedNotByInteraction();
        }}
        close={() => app.unmountCurrForm()}
      />
    );
  });
}

export default renderEditLayoutInApp;
