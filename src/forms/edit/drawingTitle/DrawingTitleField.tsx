import { AppInterface as App } from '../../../AppInterface';
import * as React from 'react';
import { TextField } from '../../fields/text/TextField';

interface Props {
  app: App;
}

export function DrawingTitleField(props: Props): React.ReactElement {
  return (
    <TextField
      name='Drawing Title'
      initialValue={props.app.drawingTitle}
      set={v => {
        v = v.trim();
        if (v) {
          if (v != props.app.drawingTitle) {
            props.app.drawingTitle = v;
            props.app.drawingChangedNotByInteraction();
          }
        } else {
          props.app.unspecifyDrawingTitle();
          props.app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}

export function DrawingTitleDescription() {
  return (
    <p>
      When left unspecified, the title of a drawing defaults to
      the ID of the sequence of the drawing.
    </p>
  );
}
