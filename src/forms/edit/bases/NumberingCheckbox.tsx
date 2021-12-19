import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { orientBaseNumberings } from 'Draw/bases/number/orient';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

export type Props = {
  app: App;

  // the base to edit
  base: Base;
}

export function NumberingCheckbox(props: Props) {
  return (
    <Checkbox
      checked={props.base.numbering ? true : false}
      onChange={event => {
        if (!event.target.checked) {
          props.app.pushUndo();
          removeNumbering(props.base);
          props.app.refresh();
          return;
        }

        let drawing = props.app.strictDrawing.drawing;

        // the number for the numbering to be added
        let n = 0; // default to zero

        let seq = drawing.sequences.find(seq => seq.bases.includes(props.base));
        if (seq) {
          n = seq.positionOf(props.base);
          let no = numberingOffset(seq);
          if (no != undefined) {
            n += no;
          }
        }

        // add numbering
        props.app.pushUndo();
        addNumbering(props.base, n);
        orientBaseNumberings(drawing);
        props.app.refresh();
      }}
    />
  );
}
