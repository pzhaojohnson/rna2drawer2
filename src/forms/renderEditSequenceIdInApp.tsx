import * as React from 'react';
import EditSequenceId from './EditSequenceId';
import App from '../App';

export function renderEditSequenceIdInApp(app: App) {
  app.renderForm(() => {
    let currId = '';
    let drawing = app.strictDrawing.drawing;
    let seq = drawing.getSequenceAtIndex(0);
    if (seq) {
      currId = seq.id;
    }
    return (
      <EditSequenceId
        currId={currId}
        apply={(id: string) => {
          let drawing = app.strictDrawing.drawing;
          let seq = drawing.getSequenceAtIndex(0);
          if (seq && id !== seq.id) {
            app.pushUndo();
            seq.id = id;
            app.drawingChangedNotByInteraction();
          }
        }}
        close={() => app.unmountCurrForm()}
      />
    );
  });
}

export default renderEditSequenceIdInApp;
