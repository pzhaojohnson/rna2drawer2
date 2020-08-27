import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
const uuidv1 = require('uuid/v1');
import Title from '../../Title';
import Underline from '../../Underline';
import RotationField from './RotationField';
import FlatOutermostLoopField from './FlatOutermostLoopField';
import TerminiGapField from './TerminiGapField';
import App from '../../../App';

interface Props {
  rotationField: React.ReactElement;
  flatOutermostLoopField: React.ReactElement;
  terminiGapField?: React.ReactElement;
  close: () => void;
}

class EditLayout extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let hasRoundOutermostLoop = app.strictDrawing.hasRoundOutermostLoop();
    return (
      <EditLayout
        rotationField={RotationField.create(app)}
        flatOutermostLoopField={FlatOutermostLoopField.create(app)}
        terminiGapField={hasRoundOutermostLoop ? TerminiGapField.create(app) : undefined}
        close={() => app.unmountCurrForm()}
      />
    );
  }

  render() {
    return (
      <ClosableContainer
        close={() => this.props.close()}
        children={[
          <div
            key={uuidv1()}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Title text={'Edit Layout'} margin={'16px 32px 0px 32px'} />
            <Underline margin={'8px 16px 0px 16px'} />
            <div style={{ margin: '24px 40px 0px 40px' }} >
              {this.props.rotationField}
            </div>
            <div style={{ margin: '16px 40px 0px 40px' }} >
              {this.props.flatOutermostLoopField}
            </div>
            <div style={{ margin: '16px 40px 0px 40px' }} >
              {this.props.terminiGapField}
            </div>
          </div>
        ]}
      />
    );
  }
}

export default EditLayout;
