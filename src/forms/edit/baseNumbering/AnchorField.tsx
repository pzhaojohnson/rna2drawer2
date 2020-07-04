import * as React from 'react';
import IntegerField from '../../fields/text/IntegerField';import App from '../../../App';

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
      <IntegerField
        name={'Anchor'}
        initialValue={this.props.currAnchor}
        set={(n: number) => this.props.setAnchor(n)}
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
