import * as React from 'react';
import ColorField from '../../fields/ColorField';
import App from '../../../App';

interface Props {
  currStroke: string;
  setStroke: (s: string) => void;
}

export class StrokeField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
    let selected = interaction.selected;
    return (
      <StrokeField
        currStroke={selected ? selected.stroke : '#000000'}
        setStroke={(s: string) => {
          let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
          let selected = interaction.selected;
          if (selected && s != selected.stroke) {
            app.pushUndo();
            selected.stroke = s;
            if (selected.fill && selected.fill.toLowerCase() != 'none') {
              selected.fill = s;
            }
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <ColorField
        name={'Color'}
        initialValue={this.props.currStroke}
        set={(s: string) => this.props.setStroke(s)}
      />
    );
  }
}

export default StrokeField;
