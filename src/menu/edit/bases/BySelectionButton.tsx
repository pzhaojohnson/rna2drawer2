import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { selectedRange } from 'Draw/interact/fold/selected';
import { DroppedButton } from '../../DroppedButton';

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

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function BySelectionButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'By Selection'}
      onClick={() => {
        let interaction = props.app.strictDrawingInteraction;
        let ps = foldingSelection(props.app);
        interaction.startAnnotating();
        if (ps) {
          interaction.annotatingMode.select(ps);
        }
        interaction.annotatingMode.requestToRenderForm();
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
