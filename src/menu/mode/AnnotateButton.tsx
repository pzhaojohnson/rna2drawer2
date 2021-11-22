import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { selectedRange } from 'Draw/interact/fold/selected';
import { DroppedButton } from 'Menu/DroppedButton';

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

export function AnnotateButton(props: Props) {
  return (
    <DroppedButton
      text='Edit Bases'
      onClick={() => {
        let interaction = props.app.strictDrawingInteraction;
        if (!interaction.annotating()) {
          let ps = foldingSelection(props.app);
          interaction.startAnnotating();
          if (ps) {
            interaction.annotatingMode.select(ps);
          }
        }
      }}
      disabled={props.app.strictDrawingInteraction.annotating()}
      checked={props.app.strictDrawingInteraction.annotating()}
    />
  );
}
