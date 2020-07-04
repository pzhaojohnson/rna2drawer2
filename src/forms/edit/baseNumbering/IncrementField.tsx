import * as React from 'react';
import TextField from '../../fields/text/TextField';
import App from '../../../App';

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
      <TextField
        name={'Increment'}
        initialValue={this.props.currIncrement.toString()}
        checkValue={(v: string) => {
          let i = Number.parseInt(v);
          if (typeof i !== 'number' || !Number.isFinite(i)) {
            return 'Numbering increment must be a number.';
          } else if (Math.floor(i) !== i) {
            return 'Numbering increment must be an integer.';
          } else if (i < 1) {
            return 'Numbering increment must be positive.';
          }
          return '';
        }}
        set={(v: string) => {
          let i = Number.parseInt(v);
          this.props.setIncrement(i);
        }}
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
