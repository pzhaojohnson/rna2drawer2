import * as React from 'react';
import { TextButton } from 'Forms/buttons/TextButton';
import type { App } from 'App';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { bringToFront } from 'Draw/bases/z';

export type Props = {
  app: App;

  // the bases to bring to the front
  bases: Base[];
}

export function BringToFrontButton(props: Props) {
  return (
    <TextButton
      text='Bring to Front'
      onClick={() => {
        props.app.pushUndo();
        props.bases.forEach(b => bringToFront(b));
        props.app.refresh();
      }}
    />
  );
}
