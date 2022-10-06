import type { App } from 'App';

import type { Base } from 'Draw/bases/Base';

import * as React from 'react';

import { ColorAttributePicker } from 'Forms/edit/svg/ColorAttributePicker';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The bases to edit.
   */
  bases: Base[];
}

export function FillPicker(props: Props) {
  return (
    <ColorAttributePicker
      elements={props.bases.map(b => b.text)}
      attributeName='fill'
      onBeforeEdit={() => {
        props.app.pushUndo();
      }}
      onEdit={() => {
        props.app.refresh();
      }}
    />
  );
}
