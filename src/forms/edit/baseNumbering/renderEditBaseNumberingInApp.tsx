import * as React from 'react';
import {
  EditBaseNumbering,
  NumberingProps,
} from './EditBaseNumbering';
import App from '../../../App';

export function renderEditBaseNumberingInApp(app: App) {
  app.renderForm(() => {
    let offset = 0;
    let anchor = 0;
    let increment = 20;
    let drawing = app.strictDrawing.drawing;
    let seq = drawing.getSequenceAtIndex(0);
    if (seq) {
      offset = seq.numberingOffset;
      anchor = seq.numberingAnchor;
      increment = seq.numberingIncrement;
    }
    return (
      <EditBaseNumbering
        offset={offset}
        anchor={anchor}
        increment={increment}
        apply={(props: NumberingProps) => {
          let drawing = app.strictDrawing.drawing;
          let seq = drawing.getSequenceAtIndex(0);
          if (seq) {
            let different = seq.numberingOffset != props.offset
              || seq.numberingAnchor != props.anchor
              || seq.numberingIncrement != props.increment;
            if (different) {
              app.pushUndo();
              seq.numberingOffset = props.offset;
              seq.numberingAnchor = props.anchor;
              seq.numberingIncrement = props.increment;
              drawing.adjustBaseNumbering();
              app.drawingChangedNotByInteraction();
            }
          }
        }}
        close={() => app.unmountCurrForm()}
      />
    );
  });
}

export default renderEditBaseNumberingInApp;
