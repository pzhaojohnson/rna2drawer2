import * as React from 'react';
import { Checkbox } from 'Forms/inputs/checkbox/Checkbox';
import { ChangeEvent } from 'Forms/inputs/checkbox/Checkbox';
import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';
import { isNumbered } from 'Draw/bases/number/isNumbered';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { orientBaseNumberings } from 'Draw/bases/number/orient';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

export type Props = {
  app: App;

  // the base to edit
  base: Base;
}

export class NumberingCheckbox extends React.Component<Props> {
  render() {
    return (
      <Checkbox
        checked={isNumbered(this.props.base)}
        onChange={event => this.handleChange(event)}
      />
    );
  }

  handleChange(event: ChangeEvent) {
    if (!event.target.checked) {
      this.props.app.pushUndo();
      removeNumbering(this.props.base);
      this.props.app.refresh();
      return;
    }

    let drawing = this.props.app.strictDrawing.drawing;

    // the number for the numbering to be added
    let n = 0; // default to zero

    let seq = drawing.sequences.find(seq => seq.bases.includes(this.props.base));
    if (seq) {
      n = seq.positionOf(this.props.base);
      let no = numberingOffset(seq);
      if (no != undefined) {
        n += no;
      }
    }

    // add numbering
    this.props.app.pushUndo();
    addNumbering(this.props.base, n);
    orientBaseNumberings(drawing);
    this.props.app.refresh();
  }
}
