import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import trimPadding from './trimPadding';
import { AppInterface as App } from '../../../AppInterface';

export function PaddingField1(app: App): React.ReactElement {
  let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
  return (
    <NonnegativeNumberField
      name={'Base Padding 1'}
      initialValue={interaction.selected ? trimPadding(interaction.selected.padding1) : undefined}
      set={p => {
        let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
        if (interaction.selected && trimPadding(interaction.selected.padding1) != trimPadding(p)) {
          app.pushUndo();
          interaction.selected.padding1 = p;
          app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}

export default PaddingField1;
