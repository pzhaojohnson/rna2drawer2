import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import { RotationField } from './RotationField';
import { FlatOutermostLoopField } from './FlatOutermostLoopField';
import { TerminiGapField } from './TerminiGapField';
import { AppInterface as App } from '../../../AppInterface';

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
        rotationField={<RotationField app={app} />}
        flatOutermostLoopField={<FlatOutermostLoopField app={app} />}
        terminiGapField={hasRoundOutermostLoop ? <TerminiGapField app={app} /> : undefined}
        close={() => app.unmountCurrForm()}
      />
    );
  }

  render() {
    return (
      <ClosableContainer
        close={() => this.props.close()}
        title={'Edit Layout'}
        contained={
          <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {this.props.rotationField}
            <div style={{ marginTop: '16px' }} >
              {this.props.flatOutermostLoopField}
            </div>
            <div style={{ marginTop: '16px' }} >
              {this.props.terminiGapField}
            </div>
          </div>
        }
      />
    );
  }
}

export default EditLayout;
