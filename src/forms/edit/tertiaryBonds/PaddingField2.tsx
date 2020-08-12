import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import trimPadding from './trimPadding';
import App from '../../../App';

export function PaddingField2(app: App): React.ReactElement {
  let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
  return (
    <NonnegativeNumberField
      name={'Base Padding 2'}
      initialValue={interaction.selected ? trimPadding(interaction.selected.padding2) : undefined}
      set={p => {
        let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
        if (interaction.selected && trimPadding(interaction.selected.padding2) != trimPadding(p)) {
          app.pushUndo();
          interaction.selected.padding2 = p;
          app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}

export default PaddingField2;
