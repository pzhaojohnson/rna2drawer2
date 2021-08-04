import * as React from 'react';
import IntegerField from '../../fields/text/IntegerField';
import { AppInterface as App } from '../../../AppInterface';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

interface Props {
  currOffset: number;
  setOffset: (o: number) => void;
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
            orientBaseNumberings(app.strictDrawing.drawing);
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <IntegerField
        name={'Offset'}
        initialValue={this.props.currOffset}
        set={(n: number) => this.props.setOffset(n)}
      />
    );
  }
}

OffsetField.defaultProps = {
  currOffset: 0,
  setOffset: () => console.error('Missing callback to set offset.'),
};

export default OffsetField;
