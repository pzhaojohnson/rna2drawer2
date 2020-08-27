import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import SequenceIdField from './SequenceIdField';
import App from '../../../App';

interface Props {
  sequenceIdField: React.ReactElement;
  close: () => void;
}

export class EditSequenceId extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    return (
      <EditSequenceId
        sequenceIdField={SequenceIdField.create(app)}
        close={() => app.unmountCurrForm()}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <ClosableContainer
        close={() => this.props.close()}
        title={'Edit Sequence ID'}
        contained={
          <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {this.props.sequenceIdField}
          </div>
        }
      />
    );
  }
}

export default EditSequenceId;
