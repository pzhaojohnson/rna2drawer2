import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import Title from '../../Title';
import Underline from '../../Underline';
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
        contained={
          <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Title text={'Edit Sequence ID'} margin={'16px 32px 0px 32px'} />
            <Underline margin={'8px 16px 0px 16px'} />
            <div style={{ margin: '24px 40px 0px 40px' }} >
              {this.props.sequenceIdField}
            </div>
          </div>
        }
      />
    );
  }
}

export default EditSequenceId;
