import type { App } from 'App';

import type { Base } from 'Draw/bases/Base';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';

import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { orientBaseNumberings } from 'Draw/bases/number/orient';

import * as React from 'react';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];
}

export class NumberingCheckbox extends React.Component<Props> {
  render() {
    return (
      <input
        type='checkbox'
        checked={(
          this.props.bases.length > 0
          && this.props.bases.every(base => base.numbering)
        )}
        onChange={event => this.handleChange(event)}
      />
    );
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.app.pushUndo();

    if (event.target.checked) {
      this.addNumberings();
    } else {
      this.removeNumberings();
    }

    this.props.app.refresh();
  }

  addNumberings() {
    let drawing = this.props.app.strictDrawing.drawing;

    // maintain preexisting numberings
    let unnumberedBases = this.props.bases.filter(base => !base.numbering);

    unnumberedBases.forEach(base => {
      let n = 0; // the number for the base (default to zero)

      let sequence = drawing.sequences.find(sequence => sequence.bases.includes(base));
      if (sequence) {
        n = sequence.positionOf(base);
        n += numberingOffset(sequence) ?? 0;
      }

      addNumbering(base, n);
    });

    orientBaseNumberings(drawing);
  }

  removeNumberings() {
    this.props.bases.forEach(base => removeNumbering(base));
  }
}
