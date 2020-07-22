import * as React from 'react';
import CheckboxField from '../../fields/CheckboxField';
import App from '../../../App';
import { TertiaryBond } from '../../../draw/QuadraticBezierBond';

interface Props {
  isDashed: boolean;
  set: (v: boolean) => void;
}

export class DashedField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
    let selected = interaction.selected;
    return (
      <DashedField
        isDashed={(selected && selected.strokeDasharray) ? true : false}
        set={(v: boolean) => {
          let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
          let selected = interaction.selected;
          let isDashed = (selected && selected.strokeDasharray) ? true : false;
          if (selected && v != isDashed) {
            app.pushUndo();
            selected.strokeDasharray = v ? TertiaryBond.dashedStrokeDasharray : '';
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <CheckboxField
        name={'Dashed'}
        initialValue={this.props.isDashed}
        set={(v: boolean) => this.props.set(v)}
      />
    );
  }
}

export default DashedField;
