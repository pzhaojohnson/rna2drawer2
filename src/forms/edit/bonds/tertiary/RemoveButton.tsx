import * as React from 'react';
import { SubmitButton } from 'Forms/buttons/SubmitButton';
import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { removeTertiaryBondById } from 'Draw/bonds/curved/remove';

export type Props = {
  app: App;

  // the tertiary bonds to remove
  tertiaryBonds: TertiaryBond[];
}

export function RemoveButton(props: Props) {
  return (
    <SubmitButton
      onClick={() => {
        if (props.tertiaryBonds.length > 0) {
          props.app.pushUndo();
          let ids = props.tertiaryBonds.map(tb => tb.id);
          ids.forEach(id => {
            removeTertiaryBondById(props.app.strictDrawing.drawing, id);
          });
          props.app.refresh();
        }
      }}
    >
      Remove
    </SubmitButton>
  );
}
