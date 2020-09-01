import * as React from 'react';
import CheckboxField from '../../fields/CheckboxField';
import { AppInterface as App } from '../../../AppInterface';

interface Props {
  hasFlatOutermostLoop: boolean;
  set: (v: boolean) => void;
}

export class FlatOutermostLoopField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    return (
      <FlatOutermostLoopField
        hasFlatOutermostLoop={app.strictDrawing.hasFlatOutermostLoop()}
        set={(v: boolean) => {
          if (v != app.strictDrawing.hasFlatOutermostLoop()) {
            app.pushUndo();
            if (v) {
              app.strictDrawing.flatOutermostLoop();
            } else {
              app.strictDrawing.roundOutermostLoop();
            }
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <CheckboxField
        name={'Flat Outermost Loop'}
        initialValue={this.props.hasFlatOutermostLoop}
        set={(v: boolean) => this.props.set(v)}
      />
    );
  }
}

export default FlatOutermostLoopField;
