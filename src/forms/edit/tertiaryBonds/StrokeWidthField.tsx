import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import App from '../../../App';

interface Props {
  currStrokeWidth: number;
  setStrokeWidth: (sw: number) => void;
}

export class StrokeWidthField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
    let selected = interaction.selected;
    return (
      <StrokeWidthField
        currStrokeWidth={selected ? selected.strokeWidth : 0}
        setStrokeWidth={(sw: number) => {
          let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
          let selected = interaction.selected;
          if (selected && sw != selected.strokeWidth) {
            app.pushUndo();
            selected.strokeWidth = sw;
            app.renderPeripherals();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <NonnegativeNumberField
        name={'Line Width'}
        initialValue={this.props.currStrokeWidth}
        set={(n: number) => this.props.setStrokeWidth(n)}
      />
    );
  }
}

export default StrokeWidthField;
