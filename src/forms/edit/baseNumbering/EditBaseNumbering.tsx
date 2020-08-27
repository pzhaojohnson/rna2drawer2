import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import Title from '../../Title';
import Underline from '../../Underline';
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
        contained={
          <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Title text={'Edit Numbering'} margin={'16px 32px 0px 32px'} />
            <Underline margin={'8px 16px 0px 16px'} />
            <div style={{ margin: '24px 40px 0px 40px' }} >
              {this.props.offsetField}
            </div>
            <div style={{ margin: '16px 40px 0px 40px' }} >
              {this.props.anchorField}
            </div>
            <div style={{ margin: '16px 40px 0px 40px' }} >
              {this.props.incrementField}
            </div>
          </div>
        }
      />
    );
  }
}

export default EditBaseNumbering;
