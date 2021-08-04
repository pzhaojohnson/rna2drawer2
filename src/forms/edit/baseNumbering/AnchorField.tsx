import * as React from 'react';
import IntegerField from '../../fields/text/IntegerField';
import { AppInterface as App } from '../../../AppInterface';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

interface Props {
  currAnchor: number;
  setAnchor: (a: number) => void;
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
              orientBaseNumberings(app.strictDrawing.drawing);
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
      />
    );
  }
}

AnchorField.defaultProps = {
  currAnchor: 0,
  setAnchor: () => console.error('Missing callback to set anchor.'),
};

export default AnchorField;
