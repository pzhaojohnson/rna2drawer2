import * as React from 'react';
import PositiveIntegerField from '../../fields/text/PositiveIntegerField';
import { AppInterface as App } from '../../../AppInterface';

interface Props {
  currIncrement: number;
  setIncrement: (i: number) => void;
  minLabelWidth?: string;
}

export class IncrementField extends React.Component {
  static defaultProps: Props;

  props!: Props;

  static create(app: App): React.ReactElement {
    let currIncrement = 20;
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    if (seq) {
      currIncrement = seq.numberingIncrement;
    }
    return (
      <IncrementField
        currIncrement={currIncrement}
        setIncrement={(i: number) => {
          let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
          if (seq && i != seq.numberingIncrement) {
            app.pushUndo();
            seq.numberingIncrement = i;
            app.strictDrawing.drawing.adjustBaseNumbering();
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <PositiveIntegerField
        name={'Increment'}
        initialValue={this.props.currIncrement}
        set={(n: number) => this.props.setIncrement(n)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

IncrementField.defaultProps = {
  currIncrement: 20,
  setIncrement: () => console.error('Missing callback to set increment.'),
  minLabelWidth: '64px',
};

export default IncrementField;
