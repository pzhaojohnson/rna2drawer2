import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import StrokeField from './StrokeField';
import StrokeWidthField from './StrokeWidthField';
import DashedField from './DashedField';
import PaddingField1 from './PaddingField1';
import PaddingField2 from './PaddingField2';
import { AppInterface as App } from '../../../AppInterface';

interface Props {
  close: () => void;
  noSelection: boolean;
  strokeField?: React.ReactElement;
  strokeWidthField?: React.ReactElement;
  dashedField?: React.ReactElement;
  paddingField1?: React.ReactElement;
  paddingField2?: React.ReactElement;
}

export class EditTertiaryBond extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
    let selected = interaction.selected;
    return (
      <EditTertiaryBond
        close={() => app.unmountCurrForm()}
        noSelection={selected ? false : true}
        strokeField={selected ? StrokeField.create(app) : undefined}
        strokeWidthField={selected ? StrokeWidthField.create(app) : undefined}
        dashedField={selected ? DashedField.create(app) : undefined}
        paddingField1={selected ? PaddingField1(app) : undefined}
        paddingField2={selected ? PaddingField2(app) : undefined}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <ClosableContainer
        close={() => this.props.close()}
        title={'Edit Tertiary Bond'}
        contained={
          <div
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {this.props.noSelection ? this.noSelectionMessage() : this.fields()}
          </div>
        }
      />
    );
  }

  noSelectionMessage(): React.ReactElement {
    return <p>No tertiary bond is selected.</p>;
  }

  fields(): React.ReactElement {
    return (
      <div>
        {this.props.strokeField}
        <div style={{ marginTop: '16px' }} >
          {this.props.strokeWidthField}
        </div>
        <div style={{ marginTop: '16px' }} >
          {this.props.dashedField}
        </div>
        <div style={{ marginTop: '16px' }} >
          {this.props.paddingField1}
        </div>
        <div style={{ marginTop: '16px' }} >
          {this.props.paddingField2}
        </div>
      </div>
    );
  }
}

export default EditTertiaryBond;
