import * as React from 'react';
import isAllWhitespace from '../../../parse/isAllWhitespace';
import TextField from '../../TextField';
import App from '../../../App';

interface Props {
  currSequenceId: string;
  setSequenceId: (id: string) => void;
}

export class SequenceIdField extends React.Component {
  static defaultProps: Props;
  
  props!: Props;
  
  static create(app: App): React.ReactElement {
    let currId = '';
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    if (seq) {
      currId = seq.id;
    }
    return (
      <SequenceIdField
        currSequenceId={currId}
        setSequenceId={(id: string) => {
          let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
          if (seq && id !== seq.id) {
            app.pushUndo();
            seq.id = id;
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <TextField
        name={'Sequence ID'}
        initialValue={this.props.currSequenceId}
        checkValue={id => {
          if (id.length == 0 || isAllWhitespace(id)) {
            return 'Sequence ID cannot be empty.';
          }
          return '';
        }}
        set={id => this.props.setSequenceId(id.trim())}
      />
    );
  }
}

SequenceIdField.defaultProps = {
  currSequenceId: '',
  setSequenceId: () => console.error('Missing callback to set sequence ID.'),
};

export default SequenceIdField;
