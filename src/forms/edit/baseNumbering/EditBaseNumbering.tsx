import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import OffsetField from './OffsetField';
import AnchorField from './AnchorField';
import IncrementField from './IncrementField';
import App from '../../../App';

interface Props {
  offsetField: React.ReactElement;
  anchorField: React.ReactElement;
  incrementField: React.ReactElement;
  close: () => void;
}

export class EditBaseNumbering extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    return (
      <EditBaseNumbering
        offsetField={OffsetField.create(app)}
        anchorField={AnchorField.create(app)}
        incrementField={IncrementField.create(app)}
        close={() => app.unmountCurrForm()}
      />
    );
  }

  render() {
    return (
      <ClosableContainer
        close={() => this.props.close()}
        title={'Edit Numbering'}
        contained={
          <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {this.props.offsetField}
            <div style={{ marginTop: '16px' }} >
              {this.props.anchorField}
            </div>
            <div style={{ marginTop: '16px' }} >
              {this.props.incrementField}
            </div>
          </div>
        }
      />
    );
  }
}

export default EditBaseNumbering;
