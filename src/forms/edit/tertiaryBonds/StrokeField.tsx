import * as React from 'react';
import { ColorField, ColorAndOpacity } from '../../fields/color/ColorField';
import App from '../../../App';

interface Props {
  currStroke?: ColorAndOpacity;
  setStroke: (s: ColorAndOpacity) => void;
}

export class StrokeField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
    let selected = interaction.selected;
    return (
      <StrokeField
        currStroke={selected ? { color: selected.stroke, opacity: selected.strokeOpacity } : undefined}
        setStroke={(s: ColorAndOpacity) => {
          let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
          let selected = interaction.selected;
          if (selected) {
            if (s.color != selected.stroke || s.opacity != selected.strokeOpacity) {
              app.pushUndo();
              selected.stroke = s.color;
              if (selected.fill && selected.fill.toLowerCase() != 'none') {
                selected.fill = s.color;
              }
              selected.strokeOpacity = s.opacity;
              app.drawingChangedNotByInteraction();
            }
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
        set={(s: ColorAndOpacity) => this.props.setStroke(s)}
      />
    );
  }
}

export default StrokeField;
