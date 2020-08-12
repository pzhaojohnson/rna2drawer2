import * as React from 'react';
import ClosableContainer from '../../ClosableContainer';
const uuidv1 = require('uuid/v1');
import Title from '../../Title';
import Underline from '../../Underline';
import StrokeField from './StrokeField';
import StrokeWidthField from './StrokeWidthField';
import DashedField from './DashedField';
import PaddingField1 from './PaddingField1';
import PadddingField2, { PaddingField2 } from './PaddingField2';
import App from '../../../App';

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
        children={[
          <div
            key={uuidv1()}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Title text={'Edit Tertiary Bond'} margin={'16px 32px 0px 32px'} />
            <Underline margin={'8px 16px 0px 16px'} />
            {this.props.noSelection ? this.noSelectionMessage() : this.fields()}
          </div>
        ]}
      />
    );
  }

  noSelectionMessage(): React.ReactElement {
    return (
      <p style={{ margin: '24px 40px 0px 40px' }} >
        No tertiary bond is selected.
      </p>
    );
  }

  fields(): React.ReactElement {
    return (
      <div>
        <div style={{ margin: '24px 40px 0px 40px' }} >
          {this.props.strokeField}
        </div>
        <div style={{ margin: '16px 40px 0px 40px' }} >
          {this.props.strokeWidthField}
        </div>
        <div style={{ margin: '16px 40px 0px 40px' }} >
          {this.props.dashedField}
        </div>
        <div style={{ margin: '16px 40px 0px 40px' }} >
          {this.props.paddingField1}
        </div>
        <div style={{ margin: '16px 40px 0px 40px' }} >
          {this.props.paddingField2}
        </div>
      </div>
    );
  }
}

export default EditTertiaryBond;
