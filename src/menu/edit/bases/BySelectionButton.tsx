import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { selectedRange } from 'Draw/interact/fold/selected';

function foldingSelection(app: App): number[] | undefined {
  let interaction = app.strictDrawingInteraction;
  if (interaction.folding()) {
    let r = selectedRange(interaction.foldingMode);
    if (r) {
      let ps: number[] = [];
      r.fromStartToEnd(p => ps.push(p));
      return ps;
    }
  }
}

export type Props = {
  app: App;
}

export function BySelectionButton(props: Props) {
  return (
    <DroppedButton
      text='By Selection'
      onClick={() => {
        let interaction = props.app.strictDrawingInteraction;
        let ps = foldingSelection(props.app);
        interaction.startAnnotating();
        if (ps) {
          interaction.annotatingMode.select(ps);
        }
        interaction.annotatingMode.requestToRenderForm();
      }}
    />
  );
}
