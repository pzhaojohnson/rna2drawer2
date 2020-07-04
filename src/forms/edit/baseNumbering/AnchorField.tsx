import * as React from 'react';
import TextField from '../../TextField';
import App from '../../../App';

interface Props {
  currAnchor: number;
  setAnchor: (a: number) => void;
  minLabelWidth?: string;
}

export class AnchorField extends React.Component {
  static defaultProps: Props;

  props!: Props;

  static create(app: App): React.ReactElement {
    let currAnchor = 0;
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    if (seq) {
      currAnchor = seq.numberingAnchor + seq.numberingOffset;
    }
    return (
      <AnchorField
        currAnchor={currAnchor}
        setAnchor={(a: number) => {
          let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
          if (seq) {
            a -= seq.numberingOffset;
            if (a != seq.numberingAnchor) {
              app.pushUndo();
              seq.numberingAnchor = a;
              app.strictDrawing.drawing.adjustBaseNumbering();
              app.drawingChangedNotByInteraction();
            }
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <TextField
        name={'Anchor'}
        initialValue={this.props.currAnchor.toString()}
        checkValue={(v: string) => {
          let a = Number.parseInt(v);
          if (typeof a !== 'number' || !Number.isFinite(a)) {
            return 'Numbering anchor must be a number.';
          } else if (Math.floor(a) !== a) {
            return 'Numbering anchor must be an integer.';
          }
          return '';
        }}
        set={(v: string) => {
          let a = Number.parseInt(v);
          this.props.setAnchor(a);
        }}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

AnchorField.defaultProps = {
  currAnchor: 0,
  setAnchor: () => console.error('Missing callback to set anchor.'),
  minLabelWidth: '64px',
};

export default AnchorField;
