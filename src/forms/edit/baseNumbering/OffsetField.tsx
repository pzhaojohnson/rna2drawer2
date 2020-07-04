import * as React from 'react';
import TextField from '../../fields/text/TextField';
import App from '../../../App';

interface Props {
  currOffset: number;
  setOffset: (o: number) => void;
  minLabelWidth: string;
}

export class OffsetField extends React.Component {
  static defaultProps: Props;

  props!: Props;

  static create(app: App): React.ReactElement {
    let currOffset = 0;
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    if (seq) {
      currOffset = seq.numberingOffset;
    }
    return (
      <OffsetField
        currOffset={currOffset}
        setOffset={(o: number) => {
          let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
          if (seq && o != seq.numberingOffset) {
            app.pushUndo();
            seq.numberingOffset = o;
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
        name={'Offset'}
        initialValue={this.props.currOffset.toString()}
        checkValue={(v: string) => {
          let o = Number.parseInt(v);
          if (typeof o !== 'number' || !Number.isFinite(o)) {
            return 'Numbering offset must be a number.';
          } else if (Math.floor(o) !== o) {
            return 'Numbering offset must be an integer.';
          }
          return '';
        }}
        set={(v: string) => {
          let o = Number.parseInt(v);
          this.props.setOffset(o);
        }}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

OffsetField.defaultProps = {
  currOffset: 0,
  setOffset: () => console.error('Missing callback to set offset.'),
  minLabelWidth: '64px',
};

export default OffsetField;
